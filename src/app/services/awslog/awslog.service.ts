import { RacetrackService } from './../racetrack/racetrack.service';
import { Injectable } from '@angular/core';
import { CloudWatchLogs, Credentials, S3 } from 'aws-sdk';
import { compress, decompress } from 'lz-string';


@Injectable({
  providedIn: 'root'
})
export class AwslogService {
  // AWS objects
  cloudwatch = null;
  s3 = null;

  trainingProps = {};
  stepArr = []; // Array of all logs
  hrArr = []; // Array of all header records
  logObj = {}; // Associative array by iteration and episode
  s3LocationData: any = {}; // Associative array of the s3 bucket, object key, region
  modelFileArr = []; // List of objects with short and fully qualified S3 model files (*.pb)
  s3FileData = null;

  loadStatus = { // [READY, IN_PROGRESS, COMPLETE, ERROR, SKIPPED]
    logDownload: 'READY',
    trackFile: 'READY',
    cache: 'READY',
    s3list: 'READY',
    messages: '',
    lastLogPartition: 0,
    lastS3ListPartition: 0
  };

  /**************************************************************************************
   * User credentials
   **************************************************************************************/
  logGroupName: string;
  logStreamName: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion: string;

  constructor(private racetrackService: RacetrackService) {
    this.logGroupName = '/aws/robomaker/SimulationJobs';
    this.logStreamName = '';
    this.awsAccessKeyId = '';
    this.awsSecretAccessKey = '';
    this.awsRegion = 'us-east-1';
  }

  /**************************************************************************************
   * Setup credentials for downloading log data from AWS
   **************************************************************************************/
  loadCloudwatchLogs() {
    // Reset load display status
    this.loadStatus.trackFile = 'READY';
    this.loadStatus.cache = 'READY';
    this.loadStatus.logDownload = 'IN_PROGRESS';
    this.loadStatus.lastLogPartition = 0;
    this.loadStatus.messages = '';

    const params: any = {};
    params.logGroupName = this.logGroupName;
    params.logStreamName = this.logStreamName;
    params.startFromHead = true;

    const awscredentials = new Credentials(this.awsAccessKeyId, this.awsSecretAccessKey);
    this.cloudwatch = new CloudWatchLogs({region: this.awsRegion, credentials: awscredentials});

    // Clear old data
    this.clearLocalVariables();
    // Recursively fetch all data
    this.fetchCloudWatchData(params);

  }

  loadRaceTrackFromWorldProp() {
    // Fetch track world param
    // tslint:disable-next-line: no-string-literal
    const trackWorldStr = this.trainingProps['/WORLD_NAME'];
    if (!trackWorldStr) {
      console.log('Unable to locate track world in log parameters');
      return;
    }
    console.log('Loading track with identifier: ' + trackWorldStr);
    this.racetrackService.loadRaceTrackByWorldString(trackWorldStr);
  }

  /**************************************************************************************
   * Make recursive download log calls from AWS to get all the data
   **************************************************************************************/
  fetchCloudWatchData(params) {
    this.loadStatus.lastLogPartition = this.loadStatus.lastLogPartition + 1;
    this.cloudwatch.getLogEvents(params, async (err, data) => {
      if (err) {
        console.dir(err);
        this.loadStatus.logDownload = 'ERROR';
        return;
      }
      // console.dir(data);
      this.parseCloudwatchSimLogs(data);
      // Make recursive call if more data is available. More data is available if previous token != returned token
      if (params.nextToken !== data.nextForwardToken) {
        console.log('Executing next fetch from AWS CloudWatch...');
        params.nextToken = data.nextForwardToken;
        this.fetchCloudWatchData(params);
      } else {
        // Download & parse of logs is complete
        this.loadStatus.logDownload = 'COMPLETE';

        // Load the racetrack data
        this.loadStatus.trackFile = 'IN_PROGRESS';

        try {
          this.loadRaceTrackFromWorldProp();
        } catch (err) {
          this.loadStatus.trackFile = 'ERROR';
          return;
        }
        this.loadStatus.trackFile = 'COMPLETE';
        // List S3 files
        this.listS3ModelFiles();
      }
    });
  }


  /**************************************************************************************
   * Parse cloudwatch deepracer log data into usable structures
   **************************************************************************************/
  parseCloudwatchSimLogs(data) {
    data.events.forEach(e => {
      const m = e.message;
      // 1) Extract training property records
      if (m.startsWith(' * ')) {
        const paramTokens = m.substring(3).split(': ');
        this.trainingProps[paramTokens[0]] = paramTokens[1];
      }
      // 2) Extract episode header records
      if (m.startsWith('Training> ')) {
        const headerTokens = m.substring(1).split(', ');
        const hr = {iteration: -1, episode: -1, steps: -1};
        this.hrArr.push(hr);
        headerTokens.forEach(pair => {
          const tuple = pair.split('=');
          hr[tuple[0].toLowerCase()] = tuple[1];
        });
        hr.iteration = Math.floor(hr.episode / 20);
        // Construct associative data structure keyed on iteration, episode {10: {25: {hr: {header...}, steps: [{step1}, {step2}, ...]}}}
        this.logObj[hr.iteration] = this.logObj[hr.iteration] || {};
        this.logObj[hr.iteration][hr.episode] = this.logObj[hr.iteration][hr.episode] || {header: hr, steps: []};
      }
      // 3) Extract step records
      if (m.startsWith('SIM_TRACE_LOG:')) {
        const logTokens = m.substring(14).split(',');
        const log = {
          iteration: Math.floor(logTokens[0] / 20),
          episode: +logTokens[0],
          steps: +logTokens[1],
          x: +logTokens[2],
          y: +logTokens[3],
          yaw: +logTokens[4],
          steer: +logTokens[5],
          throttle: +logTokens[6],
          action: +logTokens[7],
          reward: +logTokens[8],
          done: (logTokens[9] === 'True'),
          on_track: (logTokens[10] === 'True'),
          progress: +logTokens[11],
          track_len: +logTokens[13],
          closest_waypoint: +logTokens[12],
          timestamp: logTokens[14]
        };
        this.logObj[log.iteration] = this.logObj[log.iteration] || {};
        this.logObj[log.iteration][log.episode] = this.logObj[log.iteration][log.episode] || {steps: []};
        this.stepArr.push(log);
        this.logObj[log.iteration][log.episode].steps.push(log);
      }
      // 4) Extract human-readable model name
      // Successfully downloaded model metadata from model-metadata/Centerlining-2h-small-action-space-NY/model_metadata.json.
      if (m.startsWith('Successfully downloaded model metadata from model-metadata/')) {
        const modelName = m.split('/')[1];
        this.trainingProps['/MODEL_NAME'] = modelName;
      }

      // 5) Extract sagemakerBootstrap properties
      if (m.includes('simtrace_data: setup_mutipart_upload on s3_bucket ')) {
        const s3BucketStr = m.split('simtrace_data: setup_mutipart_upload on s3_bucket ')[1];
        const s3BucketArr = s3BucketStr.split(' ');
        this.s3LocationData.bucket = s3BucketArr[0]; // bucket eg. aws-deepracer-d76b507e-dda8-403a-b307-bf0afe8a8184
        this.s3LocationData.directory = s3BucketArr[2].split('/')[0]; // Directory (object_key)
        this.s3LocationData.region = s3BucketArr[4]; // Region string
      }
    });
    // 6) Post-process velocities based on position and timestamp
    Object.values(this.logObj).forEach((i: any) => {
      Object.values(i).forEach((e: any) => {
        for (let idx = 0; idx < e.steps.length; idx++) {
          if (idx === 0) {
            e.steps[idx].velocity = 0;
          } else {
            const x0 = e.steps[idx].x;
            const x1 = e.steps[idx - 1].x;
            const y0 = e.steps[idx].y;
            const y1 = e.steps[idx - 1].y;
            const distance = Math.hypot(x0 - x1, y0 - y1);
            const secondsElapsed = (+e.steps[idx].timestamp) - (e.steps[idx - 1].timestamp);
            e.steps[idx].velocity = distance / secondsElapsed; // m/s
          }
        }
      });
    });

  }

  /**************************************************************************************
   * Save data to browser cache so that it doesn't need to be re-downloaded every time
   * the browser is refreshed
   **************************************************************************************/
  saveLogDataToBrowserCache() {
    console.log('Attempting to compress and persist data in brower storage');
    const chrArr = compress(JSON.stringify(this.hrArr));
    const clogObj = compress(JSON.stringify(this.logObj));
    const ctrainingProps = compress(JSON.stringify(this.trainingProps));
    const cs3location = compress(JSON.stringify(this.s3LocationData));
    const cmodelFileArr = compress(JSON.stringify(this.modelFileArr));
    if (chrArr.length + clogObj.length < 5000000) {
      localStorage.setItem('logStreamName', this.logStreamName);
      localStorage.setItem('awsAccessKeyId', this.awsAccessKeyId);
      localStorage.setItem('awsRegion', this.awsRegion);
      localStorage.setItem('hrArr', chrArr);
      localStorage.setItem('logObj', clogObj);
      localStorage.setItem('trainingProps', ctrainingProps);
      localStorage.setItem('s3location', cs3location);
      localStorage.setItem('modelFileArr', cmodelFileArr);

      console.log('Log data saved to browser memory');
    } else {
      console.log('Log data was too big to fit in browser memory');
    }
  }

  /**************************************************************************************
   * Load data from browser cache
   * returns true if data loaded successfully, false otherwise
   **************************************************************************************/
  loadLogDataFromBrowserCache() {
    console.log('Attempting to decompress data from brower storage');
    this.logStreamName = localStorage.getItem('logStreamName');
    this.awsAccessKeyId = localStorage.getItem('awsAccessKeyId');
    const trainingProps = decompress(localStorage.getItem('trainingProps'));
    const hrArr = decompress(localStorage.getItem('hrArr'));
    const logObj = decompress(localStorage.getItem('logObj'));
    const s3location = decompress(localStorage.getItem('s3location'));
    const modelFileArr = decompress(localStorage.getItem('modelFileArr'));

    if (logObj && logObj.length > 0 && trainingProps) {
      console.log('Cached data found and loaded');
      this.trainingProps = (trainingProps) ? JSON.parse(trainingProps) : {};
      this.hrArr = (hrArr) ? JSON.parse(hrArr) : [];
      this.logObj = (logObj) ? JSON.parse(logObj) : {};
      this.s3LocationData = (s3location) ? JSON.parse(s3location) : {};
      this.modelFileArr = (modelFileArr) ? JSON.parse(modelFileArr) : [];

      // Load stepArr from logObj
      this.stepArr = [];
      console.dir(this.logObj);
      Object.values(this.logObj).forEach((it) => {
        Object.values(it).forEach((ep) => {
          Object.values(ep.steps).forEach((step) => {
            this.stepArr.push(step);
          });
        });
      });

      this.printLogState();
      // Load the racetrack data
      this.loadRaceTrackFromWorldProp();
    } else {
      console.log('No cached data found');
      return false;
    }
    this.loadStatus.logDownload = 'SKIPPED';
    this.loadStatus.trackFile = 'SKIPPED';
    this.loadStatus.cache = 'SKIPPED';
    this.loadStatus.s3list = 'SKIPPED';

    console.log('Decompression complete');
    return true;
  }

  clearLocalVariables() {
    this.trainingProps = {};
    this.stepArr = []; // Array of all logs
    this.hrArr = []; // Array of all header records
    this.logObj = {};
  }

  printLogState() {
    console.log('trainingProps : stepArr : hrArr : logObj');
    console.log('**********************');
    console.dir(this.trainingProps);
    console.dir(this.stepArr);
    console.dir(this.hrArr);
    console.dir(this.logObj);
    console.dir(this.s3LocationData);
    console.dir(this.modelFileArr);
    console.log('**********************');
  }



  /**************************************************************************************
   * Get a listing of all *.pb files in the S3 bucket key associated with the training
   **************************************************************************************/
  listS3ModelFiles() {
    if (!this.s3LocationData.bucket) {
      this.loadStatus.s3list = 'ERROR';
      return;
    }
    const self = this;
    const awscredentials = new Credentials(this.awsAccessKeyId, this.awsSecretAccessKey);
    this.s3 = new S3({params: {Bucket: this.s3LocationData.bucket}, credentials: awscredentials});

    this.loadStatus.lastS3ListPartition = this.loadStatus.lastS3ListPartition + 1;
    this.s3.listObjectsV2({Prefix: this.s3LocationData.directory + '/model'}, async function(err, data) { // Delimiter: '/',
      if (err) {
        console.dir(err);
        self.loadStatus.s3list = 'ERROR';
        return;
      } else {
        self.modelFileArr = data.Contents.filter((f) => f.Key.endsWith('.pb'));
        self.loadStatus.s3list = 'COMPLETE';

        // Print loaded data
        self.printLogState();
        // Persist log data if possible
        self.loadStatus.cache = 'IN_PROGRESS';
        try {
          await new Promise(r => {
            setTimeout(r, 1000);
          });
          self.saveLogDataToBrowserCache();
        } catch (err) {
          self.loadStatus.cache = 'ERROR';
          return;
        }
        self.loadStatus.cache = 'COMPLETE';
      }
    });
  }


  /**************************************************************************************
   * Download the S3 file with indicated key
   **************************************************************************************/
  downloadS3ModelFile(fileKey, successCallback, errorCallback) {
    if (!this.s3LocationData.bucket) { return; }
    const self = this;
    const awscredentials = new Credentials(this.awsAccessKeyId, this.awsSecretAccessKey);
    this.s3 = new S3({params: {Bucket: this.s3LocationData.bucket}, credentials: awscredentials});

    console.log('Key: ' + fileKey);
    this.s3.getObject({Key: fileKey },
      (error, data) => {
        if (error != null) {
          console.dir(error);
          errorCallback(error);
        } else {
          console.dir(data);
          this.s3FileData = data;
          successCallback(data);
        }
      });
  }
}

import { AwslogService } from './../../services/awslog/awslog.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  constructor(private awslogService: AwslogService,
              private router: Router) { }

  ngOnInit() {
    // If track/log data has not been loaded, then attempt to load data from the browser cache
    // If no cache data is found, send the user to the home page so that they can get some data
    if (!this.awslogService.stepArr || this.awslogService.stepArr.length < 1) {
      const cacheLoadSuccess = this.awslogService.loadLogDataFromBrowserCache();
      if (!cacheLoadSuccess) {
        this.router.navigate(['/home']);
      }
    }
  }

  downloadTrainingObject() {
    const dArr = this.awslogService.stepArr;
    this.downloadJsonObject(dArr, this.awslogService.trainingProps['/MODEL_NAME'] + '_data.json');
  }

  downloadPropsObject() {
    const dArr = this.awslogService.trainingProps;
    this.downloadJsonObject(dArr, this.awslogService.trainingProps['/MODEL_NAME'] + '_props.json');
  }

  downloadJsonObject(jsonObj, fileName) {
    const datablob = new Blob([JSON.stringify(jsonObj)], {type: 'text/json'});
    const downloader = document.createElement('a');
    downloader.setAttribute('href', window.URL.createObjectURL(datablob));
    downloader.setAttribute('download', fileName);
    downloader.click();
  }

}

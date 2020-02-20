import { SetupComponent } from './setup/setup.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RacetrackService } from './../../services/racetrack/racetrack.service';
import { AwslogService } from './../../services/awslog/awslog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private racetrackService: RacetrackService,
              public awslogService: AwslogService,
              public dialog: MatDialog) {
    this.racetrackService = racetrackService;
    this.awslogService = awslogService;
  }

  ngOnInit() {
    // Eager load any log data already in the browser cache
    if (!this.awslogService.stepArr || this.awslogService.stepArr.length < 1) {
      this.awslogService.loadLogDataFromBrowserCache();
    }
  }

  submitClick() {
    // this.racetrackService.loadRaceTrack('/assets/track-data/New_York_Track.json');
    this.awslogService.loadCloudwatchLogs();
  }

  launchSetupModal() {
    const dialogRef = this.dialog.open(SetupComponent, { width: '900px', height: '800px' });
  }
}

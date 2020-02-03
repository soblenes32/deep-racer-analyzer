import { Router } from '@angular/router';
import { AwslogService } from './../../services/awslog/awslog.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-policy-inspection',
  templateUrl: './policy-inspection.component.html',
  styleUrls: ['./policy-inspection.component.css']
})
export class PolicyInspectionComponent implements OnInit {

  constructor(
    private awslogService: AwslogService,
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

}

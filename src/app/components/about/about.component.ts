import { AwslogService } from './../../services/awslog/awslog.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private awslogService: AwslogService) { }

  ngOnInit() {
    if (!this.awslogService.stepArr || this.awslogService.stepArr.length < 1) {
      const cacheLoadSuccess = this.awslogService.loadLogDataFromBrowserCache();
    }
  }

}

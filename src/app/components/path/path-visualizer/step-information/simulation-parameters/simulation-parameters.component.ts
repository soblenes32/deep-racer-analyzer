import { SubscriptionService } from '../../../../../services/subscription/subscription.service';
import { AwslogService } from './../../../../../services/awslog/awslog.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulation-parameters',
  templateUrl: './simulation-parameters.component.html',
  styleUrls: ['./simulation-parameters.component.css']
})
export class SimulationParametersComponent implements OnInit {
  displayedColumns: string[];
  propertiesArr: Array<any>;

  constructor(private awslogService: AwslogService,
              private subscriptionService: SubscriptionService) {
    this.displayedColumns = ['name', 'value'];
    this.setProperties();
    subscriptionService.on('log-data-change', (e) => this.setProperties());
  }

  setProperties() {
    // Fast-fail if no logs are loaded yet
    if (!this.awslogService.stepArr || this.awslogService.stepArr.length < 0) { return; }
    this.propertiesArr = [];
    Object.keys(this.awslogService.trainingProps).forEach((k) => {
      this.propertiesArr.push({name: k.toUpperCase(), value: this.awslogService.trainingProps[k]});
    });
    this.propertiesArr.sort((a, b) => {
      return (a.name === b.name) ? 0 :
        (a.name > b.name) ? 1 : -1;
    });
  }

  ngOnInit() {
  }

}

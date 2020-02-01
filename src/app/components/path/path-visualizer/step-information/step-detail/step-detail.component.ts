import { SubscriptionService } from './../../../../../services/subscription/subscription.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-detail',
  templateUrl: './step-detail.component.html',
  styleUrls: ['./step-detail.component.css']
})
export class StepDetailComponent implements OnInit {
  displayedColumns: string[];
  stepArr: Array<any>;

  constructor(private subscriptionService: SubscriptionService) {
    this.subscriptionService.on('step-select', (e) => {
      this.displayedColumns = ['name', 'value'];
      this.setProperties(e.value);
    });
  }

  ngOnInit() {
  }

  setProperties(stepObj) {
    // Fast-fail if no logs are loaded yet
    if (!stepObj) { return; }
    this.stepArr = [];
    Object.keys(stepObj).forEach((k) => {
      this.stepArr.push({name: k.toUpperCase(), value: stepObj[k]});
    });
    this.stepArr.sort((a, b) => {
      return (a.name === b.name) ? 0 :
        (a.name > b.name) ? 1 : -1;
    });
  }

}

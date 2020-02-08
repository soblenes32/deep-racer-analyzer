import { AppEvent } from './../../../../../models/app-event';
import { SubscriptionService } from './../../../../../services/subscription/subscription.service';
import { PlotPresentationService } from './../../../../../services/plot-presentation/plot-presentation.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plot-presentation',
  templateUrl: './plot-presentation.component.html',
  styleUrls: ['./plot-presentation.component.css']
})
export class PlotPresentationComponent implements OnInit {

  constructor(
    public plotPresentationService: PlotPresentationService,
    private subscriptionService: SubscriptionService) { }
  stepMarkerColorStrategyArr = ['REWARD', 'VELOCITY', 'EPISODE', 'ACTION_CLASS'];

  ngOnInit() {
  }

  updatePlot() {
    this.plotPresentationService.updateGradients();
    const event = new AppEvent();
    event.name = 'plot-style-change';
    this.subscriptionService.emit(event);
  }

}

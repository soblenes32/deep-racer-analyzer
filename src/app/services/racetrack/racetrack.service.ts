import { AppEvent } from './../../models/app-event';
import { SubscriptionService } from '../subscription/subscription.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RacetrackService {

  constructor(private http: HttpClient,
              private subscriptionService: SubscriptionService) {
    this.http = http;
  }

  innerBoundary = [];
  outerBoundary = [];
  centerLine = [];

  loadRaceTrackFile(url) {
    this.http.get(url).subscribe((data: any[]) => {
      this.innerBoundary = [];
      this.outerBoundary = [];
      this.centerLine = [];
      data.forEach(row => {
        this.innerBoundary.push(row.slice(2, 4));
        this.outerBoundary.push(row.slice(4, 6));
        this.centerLine.push(row.slice(0, 2));
      });
      console.log('Completed load of ' + data.length + ' waypoint series in track ' + url);
      // Build and emit an event to let subscribers know
      const logEvent = new AppEvent();
      logEvent.name = 'log-data-change';
      this.subscriptionService.emit(logEvent);
    });
  }

  loadRaceTrackByWorldString(worldString) {
    const fileName = worldString + '.json';
    this.loadRaceTrackFile('assets/track-data/' + fileName);
  }
}

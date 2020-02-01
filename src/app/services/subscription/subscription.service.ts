import { AppEvent } from './../../models/app-event';
import { Injectable } from '@angular/core';
import { Subject, Subscription} from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor() { }

    // Event bus to transmit data load events
    private subject$ = new Subject();

    /************************************************************************************************
     * Change event bus
     * Subscribable event messages:
     * 'log-data-change': No payload
     * 'step-select': Object - step data
     * 'plot-style-change': No payload
     ************************************************************************************************/
    emit(event: AppEvent) {
      this.subject$.next(event);
    }

    on(eventName: string, action: any): Subscription {
      return this.subject$.pipe(
        filter((e: AppEvent) => e.name === eventName))
      .subscribe(action);
    }
}

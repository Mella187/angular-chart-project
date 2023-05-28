import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import 'moment-timezone';

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  private otherTimeZone: string = '';
  timezoneChanged: Subject<void> = new Subject<void>();
  private storageKey = 'selectedTimeZone';

  constructor() {
    const storedTimeZone = localStorage.getItem(this.storageKey);
    if (storedTimeZone) {
      this.otherTimeZone = storedTimeZone;
    }
  }

  setSharedTimeZone(value: string = moment.tz.guess()) {
    this.otherTimeZone = value;
    localStorage.setItem(this.storageKey, value);
    this.timezoneChanged.next();
  }

  getSharedTimeZone(): { hours: number; minutes: number } {
    const cityName = this.otherTimeZone || moment.tz.guess();

    const now = moment().tz(cityName);
    const hours = now.hours();
    const minutes = now.minutes();

    return { hours, minutes };
  }
}

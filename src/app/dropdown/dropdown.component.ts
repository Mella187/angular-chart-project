import { Component } from '@angular/core';
import { TimezoneService } from '../timezone.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  constructor(private sharedTimeZone: TimezoneService) {}

  selectedCity: string = '';
  cities: { name: string; timezone: string }[] = [
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },
    { name: 'London', timezone: 'Europe/London' },
    { name: 'New York', timezone: 'America/New_York' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { name: 'Sydney', timezone: 'Australia/Sydney' },
    { name: 'Dubai', timezone: 'Asia/Dubai' },
    { name: 'Paris', timezone: 'Europe/Paris' },
    { name: 'Moscow', timezone: 'Europe/Moscow' },
    { name: 'Singapore', timezone: 'Asia/Singapore' },
    { name: 'Berlin', timezone: 'Europe/Berlin' },
    { name: 'My local time', timezone: 'browser' },
  ];

  onCityChange() {
    if (this.selectedCity === 'browser') {
      const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.sharedTimeZone.setSharedTimeZone(browserTimeZone);
    } else {
      this.sharedTimeZone.setSharedTimeZone(this.selectedCity);
    }
  }
}

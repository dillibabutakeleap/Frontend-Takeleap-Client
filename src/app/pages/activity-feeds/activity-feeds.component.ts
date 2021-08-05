import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from '../pages-menu';

@Component({
  selector: 'activity-feeds',
  styleUrls: ['./activity-feeds.component.scss'],
  template: `
    <ngx-two-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-two-column-layout>
  `,
})
export class ActivityFeedsComponent implements OnInit {
  menu:any;
  constructor() { }

  ngOnInit(): void {
    this.menu = MENU_ITEMS;
  }

}

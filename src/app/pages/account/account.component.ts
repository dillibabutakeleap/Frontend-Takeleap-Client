import { Component } from '@angular/core';


@Component({
    selector: 'ngx-account',
    styleUrls: ['account.component.scss'],
    template: `
      <ngx-account-layout>
      <router-outlet></router-outlet>
      </ngx-account-layout>
    `,
  })
  export class AccountComponent {
    //
  }
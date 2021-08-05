import { Component } from '@angular/core';

@Component({
  selector: 'ngx-account-layout',
  styleUrls: ['./account.layout.scss'],
  template: `
  <div class="account-layout"><nb-layout windowMode>
  <nb-layout-column>
    <ng-content select="router-outlet"></ng-content>
  </nb-layout-column>

</nb-layout></div>
  `,
})
export class ThreeColumnsLayoutComponent {}

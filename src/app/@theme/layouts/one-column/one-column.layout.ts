import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed >
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" *ngIf="showLeft" responsive start>
        <ng-content select="nb-menu"></ng-content>
        Yatin
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>


    </nb-layout>
  `,
})

// <nb-layout-footer fixed>
// <ngx-footer></ngx-footer>
// </nb-layout-footer>

export class OneColumnLayoutComponent {
  showLeft:boolean = true;

  constructor(private router:Router){
    //console.log(this.router.url);
    
    if(router.url.indexOf("dashboard")>=0 ){
      this.showLeft = false;  
    }
    this.showLeft = false;
    
  }
}

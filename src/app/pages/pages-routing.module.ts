import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { AuthenticationGuard } from 'app/@core/guards/authentication.guard';
import { AccountComponent } from './account/account.component';
import { GlobalFeedComponent } from './activity-feeds/global-feed/global-feed.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      redirectTo: '/account/login',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AuthenticationGuard]
    }

  ],
},

{
  path: 'account',

  loadChildren: () => import('./account/account.module')
    .then(m => m.AccountModule),
},
  // {
  //   path:'activity-feeds',
  //   canActivate: [AuthenticationGuard],
  //   loadChildren: () => import('./activity-feeds/activity-feeds.module')
  //       .then(m => m.ActivityFeedsModule),
  // },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

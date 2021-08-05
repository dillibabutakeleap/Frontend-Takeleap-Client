import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityFeedsComponent } from './activity-feeds.component';
import { GlobalFeedComponent } from './global-feed/global-feed.component';

const routes: Routes = [
  {
    path:'',
    component:ActivityFeedsComponent,
    children:[
      {
        path:'',
        component:GlobalFeedComponent
      },
      // {
      //   path:'activity-feeds',
      //   component:GlobalFeedComponent
      // }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityFeedsRoutingModule { }

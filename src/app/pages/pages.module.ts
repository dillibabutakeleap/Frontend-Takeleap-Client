import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { AccountModule } from './account/account.module';
import { VideoUploadProcessModule } from './video-upload-process/video-upload-process.module';
import { VideoUploadProcessComponent } from './video-upload-process/video-upload-process.component';

import { ActivityFeedsModule } from './activity-feeds/activity-feeds.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    AccountModule,
    VideoUploadProcessModule,
    ActivityFeedsModule
  ],
  declarations: [
    PagesComponent,
    VideoUploadProcessComponent,
  ],
})
export class PagesModule {
}

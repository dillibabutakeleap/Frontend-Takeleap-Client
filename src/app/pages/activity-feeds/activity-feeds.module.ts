import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityFeedsRoutingModule } from './activity-feeds-routing.module';
import { GlobalFeedComponent } from './global-feed/global-feed.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { ActivityFeedsService } from './shared/activity-feeds.service';
import { HttpService } from 'app/@core/services/http.service';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { CommentBoxComponent } from './shared/comment-box/comment-box.component';
import { ThemeModule } from 'app/@theme/theme.module';
import { ActivityFeedsComponent } from './activity-feeds.component';
import { NbMenuModule } from '@nebular/theme';
import { FeedDynamicContentComponent } from './shared/feed-dynamic-content/feed-dynamic-content.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { PrintFeedComponent } from './shared/print-feed/print-feed.component';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { CoreModule } from 'app/@core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [GlobalFeedComponent, ImagePreviewComponent, CommentBoxComponent, ActivityFeedsComponent, FeedDynamicContentComponent, PrintFeedComponent],
  imports: [
    CommonModule,
    ActivityFeedsRoutingModule,
    MatTabsModule,
    FormsModule,
    //BrowserModule,
    MatMenuModule,
    MatSliderModule,
    MatDialogModule,
    MatIconModule,
    MatBadgeModule,
    ThemeModule,
    NbMenuModule,
    NgxImageZoomModule,
    NgbModule
    //BrowserAnimationsModule
    //CoreModule
  ],
  providers: [ActivityFeedsService, HttpService]
})
export class ActivityFeedsModule { }

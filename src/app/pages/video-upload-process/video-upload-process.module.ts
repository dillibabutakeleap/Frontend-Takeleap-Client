import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoUploadProcessRoutingModule } from './video-upload-process-routing.module';
import { VideoUploadStep1Component } from './video-upload-step1/video-upload-step1.component';
import { FormsModule } from '@angular/forms';
import { VideoUploadStep2Component } from './video-upload-step2/video-upload-step2.component';
import {MatTabsModule} from '@angular/material/tabs';
import { VideoUploadStep3Component } from './video-upload-step3/video-upload-step3.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { VideosDiscardConfirmDialogComponent } from './components/videos-discard-confirm-dialog/videos-discard-confirm-dialog.component';


@NgModule({
  declarations: [VideoUploadStep1Component, VideoUploadStep2Component, VideoUploadStep3Component, VideosDiscardConfirmDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    VideoUploadProcessRoutingModule,
    MatTabsModule,
    MatProgressBarModule,
      
  ],
  //exports:[VideoUploadStep2Component]
})
export class VideoUploadProcessModule { }

import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { VideoUploadProcessModule } from '../video-upload-process/video-upload-process.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    RouterModule,
    MatProgressBarModule
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }

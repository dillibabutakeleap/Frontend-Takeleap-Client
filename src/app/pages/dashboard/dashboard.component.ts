import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VideosProcessed } from 'app/@core/models/videos-processed';
import { NotificationService } from 'app/@core/services/notification.service';
import { NotificationComponent } from 'app/@theme/components/notification/notification.component';
import { from } from 'rxjs';
import { VideoUploadStep1Component } from '../video-upload-process/video-upload-step1/video-upload-step1.component';
import { VideoUploadStep2Component } from '../video-upload-process/video-upload-step2/video-upload-step2.component';
import { VideoUploadStep3Component } from '../video-upload-process/video-upload-step3/video-upload-step3.component';

import { HttpService } from 'app/@core/services/http.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  videosInProgress = [];
  totalProgress = 0;
  socketStatus: Boolean = true;

  constructor(private dialog: MatDialog, private router: Router, private videoProcessed: VideosProcessed, private notificationService: NotificationService, private httpService: HttpService) {
    this.videosInProgress = videoProcessed.currentValue;
    if (this.videosInProgress != null) {
      this.totalProgress = this.videoProcessed.calculateTotalProgress;

    }
    notificationService.connectionStatus.subscribe((data: Boolean) => {
      if (data)
        this.socketStatus = data;
      else
        this.socketStatus = false;
    });

  }

  ngOnInit(): void {

    this.videoProcessed.current.subscribe(data => {
      this.videosInProgress = data;
      if (this.videosInProgress != null) {
        this.totalProgress = this.videoProcessed.calculateTotalProgress;
      }
    });
  }

  uploadVideoStep1() {
    if (this.socketStatus) {
      var dialog = this.dialog.open(VideoUploadStep1Component, {
        //height:'400px',
        width: '50%',
        autoFocus: false
      });

      dialog.beforeClosed().subscribe(
        data => {
          if (data) {
            var dialogStep2 = this.dialog.open(
              VideoUploadStep2Component,
              {
                autoFocus: false,
                data: data
              }
            );
            dialogStep2.beforeClosed().subscribe(
              data => {
                if (data) {
                  this.uploadVideoStep3();
                }
              }
            );
          }

        }
      )
    } else {
      this.httpService.openErrorDialog(this.httpService.appOfflineMessage);
    }

  }

  uploadVideoStep3() {
    const confirmDialogStep3 = this.dialog.open(VideoUploadStep3Component, {
      //height:'400px',
      width: '65%',
      autoFocus: false
    });

    confirmDialogStep3.beforeClosed().subscribe(
      data => {
        if (data) {
          this.uploadVideoStep1();
        }
      }
    );
  }

  uploadVid() {
    this.dialog.open(NotificationComponent, {
      //height:'400px',
      width: '65%',
      autoFocus: false
    });
  }

  navigateToFeed() {
    this.router.navigate(['activity-feeds']);
    //this.router.navigateByUrl('/activity-feeds');
  }
}

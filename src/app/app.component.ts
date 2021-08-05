/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { stat } from 'fs';
import { BellNotifications } from './@core/models/bell-notifications';
import { VideosProcessed } from './@core/models/videos-processed';
import { NotificationService } from './@core/services/notification.service';
//import { VideosProcessed } from './@core/models/videos-processed';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SystemErrorDialogComponent } from './@theme/components/system-error-dialog/system-error-dialog.component';
import { AppSettings } from './app-settings';
import { ActivityFeedsService } from './pages/activity-feeds/shared/activity-feeds.service';
import { VideoUploadProcessService } from './pages/video-upload-process/shared/video-upload-process.service';
// import { SeoService } from './@core/utils/seo.service';

@Component({
  selector: 'ngx-app',
  styleUrls: ['app.component.scss'],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  errorDialog;

  constructor(private notificationService: NotificationService, private videoProcessed: VideosProcessed,
    private videoUploadProcessServ: VideoUploadProcessService, private dialog: MatDialog,
    private bellNotifications: BellNotifications, private activityFeedsService: ActivityFeedsService) {
    this.loadNotifications();
  }

  //Load all notifications
  loadNotifications() {
    this.activityFeedsService.getNotifications().subscribe(
      (bellNotifications: BellNotifications[]) => {
        if (bellNotifications) {
          // console.log(bellNotifications);
          this.bellNotifications.currentValue = bellNotifications;
        }
      },
      error => {
        console.log(error);

      }
    );
  }

  ngOnInit() {
    //==== On application load socket will will connect
    var timer;
    this.notificationService
      .getVideos()
      .subscribe((videos: VideosProcessed[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          console.log("stop first video if processing goes longer than 2 mints i.e "
            + "refresh not received from python");

          var progressingVideosList = videos.filter(x => x.progress > 0);

          if (videos.length > 0 && progressingVideosList.length == 0) {
            progressingVideosList = videos.filter(x => x.progress >= 0);
          }

          if (progressingVideosList.length > 0) {
            var idsInProgress = [];
            idsInProgress.push(progressingVideosList[0].id);
            const deleteData = {
              videos: idsInProgress,
              save: false
            };
            console.log(deleteData);
            //this.DeleteVideosInProgress(deleteData);
            this.videoUploadProcessServ.DeleteVideosInProgress(deleteData).subscribe(
              data => {
                //stopped
              },
            );
          }

        }, AppSettings.VIDEO_LAG_WAIT_TIME);

        this.videoProcessed.currentValue = videos;
      });

    this.notificationService.videoError().
      subscribe((message: any) => {
        this.dialog.open(SystemErrorDialogComponent, {
          data: { "title": message.videoName, "message": message.error }
        });
      });

    this.notificationService.newBellNotification().
      subscribe((data: BellNotifications[]) => {
        console.log(data);
        this.bellNotifications.currentValue = data;
      });

    this.notificationService.InitVideosUnProcessedAlert().
      subscribe((message: any) => {
        console.log(message);
        if (!this.errorDialog || this.errorDialog.getState() == MatDialogState.CLOSED) {
          this.errorDialog = this.dialog.open(SystemErrorDialogComponent, {
            data: { "message": message, "confirmTitle": "Yes", "closeTitle": "Discard" },
            disableClose: true
          });

          this.errorDialog.afterClosed().subscribe(data => {
            //data == true > Process All Videos
            //data == false > Discard All Videos
            this.videoUploadProcessServ.UpdateUnProcessedVideos(data).subscribe(data => {
              console.log(data);
            });

          });
        }

      });

    this.notificationService.CheckConnectionStatus().subscribe((messages: any) => {
      console.log(messages);
      this.bellNotifications.currentValue = messages;
    })

  }
}

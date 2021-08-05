import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VideosProcessed } from 'app/@core/models/videos-processed';
import { HeaderComponent } from 'app/@theme/components';
import { AppSettings } from 'app/app-settings';
import { VideoUploadStep1Component } from 'app/pages/video-upload-process/video-upload-step1/video-upload-step1.component';
import { VideoUploadStep2Component } from 'app/pages/video-upload-process/video-upload-step2/video-upload-step2.component';
import { VideoUploadStep3Component } from 'app/pages/video-upload-process/video-upload-step3/video-upload-step3.component';
import { HttpService } from 'app/@core/services/http.service';
import { NotificationService } from 'app/@core/services/notification.service';

@Component({
  selector: 'ngx-two-column-layout',
  styleUrls: ['./two-columns.layout.scss'],
  template: `
  <nb-layout windowMode>
  <nb-layout-header fixed >
    <ngx-header></ngx-header>
  </nb-layout-header>

  <nb-sidebar class="menu-sidebar" tag="menu-sidebar" *ngIf="showLeft" responsive start>
    <div class="uploadPanel" (click)="openProgressPopUp()" *ngIf="totalProgress <100 && videosInProgress!=null && videosInProgress.length > 0" [class]="videosInProgress.length > 0 ? 'uploadPanel_2':''">
      <div class="nav-content">
        <span>Processing <br>{{totalProgress | number : '1.1-1'}}%</span>
        
        <mat-progress-bar mode="determinate" value="{{totalProgress}}"></mat-progress-bar>
      </div>
    </div>
    <div class="uploadPanel" (click)="openUploadPopUp()" [class]="totalProgress <100 && videosInProgress!=null && videosInProgress.length > 0 ? 'uploadPanel_2':''">
      <div class="nav-content">
        <span>Upload<br>Files</span>
        <img height="20" src='../../../../assets/images/feather-upload.png'/>
      </div>
    </div>
    <div class="recordPanel">
      <div class="nav-content">
        <img height="20" src='../../../../assets/images/timer.png'/>
        <br><br>
        <span>00:00:00</span>
        <br><br>
        <button class="btn btn-white" value="Record" disabled>Record</button>
        <br>
        <button class="btn btn-white" value="Stop" disabled>Stop</button>
      </div>
    </div>
    <div class="logoutPanel" (click)="logout()">
      Logout <img height="20" src='../../../../assets/images/power.png'/>
    </div>
  </nb-sidebar>

  <nb-layout-column>
    <ng-content select="router-outlet"></ng-content>
  </nb-layout-column>


</nb-layout>
  `,
})
//<ng-content select="nb-menu"></ng-content>
export class TwoColumnsLayoutComponent {
  showLeft: boolean = true;
  videosInProgress = [];
  totalProgress = 0;
  socketStatus: Boolean = true;
  constructor(private router: Router, private dialog: MatDialog, private videoProcessed: VideosProcessed, private notificationService: NotificationService,
    private httpService: HttpService) {

    this.showLeft = true;
    this.videosInProgress = videoProcessed.currentValue;
    if (this.videosInProgress != null) {
      this.totalProgress = this.videoProcessed.calculateTotalProgress;

    }

    notificationService.connectionStatus.subscribe((data: Boolean) => {
      //console.log("Socket Connection : ", data);
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
        //console.log(this.totalProgress);
      }


      //console.log("TwoColumn - " + this.totalProgress);
    });
  }

  openUploadPopUp() {

    if (this.socketStatus) {
      this.dialog.open(VideoUploadStep1Component, {
        //height:'400px',
        width: '50%',
        autoFocus: false
      });
    }
    else {
      this.httpService.openErrorDialog(this.httpService.appOfflineMessage);
    }

  }

  openProgressPopUp() {
    this.dialog.open(VideoUploadStep3Component, {
      //height:'400px',
      width: '65%',
      autoFocus: false
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}

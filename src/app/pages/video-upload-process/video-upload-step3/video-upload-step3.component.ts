import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VideosProcessed } from 'app/@core/models/videos-processed';
import { NotificationService } from 'app/@core/services/notification.service';
import { ConfirmDialogComponent } from 'app/@theme/components/confirm-dialog/confirm-dialog.component';
import { VideoUploadProcessService } from '../shared/video-upload-process.service';
import { VideoUploadStep1Component } from '../video-upload-step1/video-upload-step1.component';

@Component({
  selector: 'video-upload-step3',
  templateUrl: './video-upload-step3.component.html',
  styleUrls: ['./video-upload-step3.component.scss']
})
export class VideoUploadStep3Component implements OnInit {
  selectedFiles = [];
  selectedForDelete = [];
  showDetails: boolean = true;
  totalProgress: number = 0;
  isVideoProgressed: boolean = false;
  lastKey: string = "";


  constructor(private videoProcessed: VideosProcessed,
    private notificationService: NotificationService,
    private videoUploadProcessServ: VideoUploadProcessService,
    private router: Router,
    private dialogRef: MatDialogRef<VideoUploadStep3Component>,
    private matDialog: MatDialog

  ) {
    this.selectedFiles = videoProcessed.currentValue;
  }

  ngOnInit(): void {
    //this.notificationService.refreshVideos();
    var timer;
    try {
      this.videoProcessed.current.subscribe(data => {
        //this.isVideoProgressed = true;

        data.forEach(element => {
          var filtrvideos = this.selectedFiles.filter(x => x.id == element.id);
          if (filtrvideos.length > 0) {
            filtrvideos[0].progress = element.progress;
            //======== remove it from stop list
            if (filtrvideos[0].progress == 100 && filtrvideos[0].isSelected)
              this.fileClick(filtrvideos[0]);
          }
          else {
            this.selectedFiles.push(element);
          }

        });


        if (this.totalProgress < 99.5)
          this.totalProgress = this.videoProcessed.calculateTotalProgress;
        else if (this.videoProcessed.calculateTotalProgress == 99.5) {
          this.totalProgress = 100;
        }

        setTimeout(() => {
          if (this.selectedFiles && this.selectedFiles.length == 0 || data.length == 0 || this.totalProgress == 100 || this.totalProgress == null) {
            this.selectedFiles = data;
            this.totalProgress = this.videoProcessed.calculateTotalProgress;
            //this.router.navigate(['activity-feeds']);
            this.dialogRef.close();
          }
        }, 500);



      });
    } catch (ex) {
      console.warn("ngOnInit error: ", ex); throw ex;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.lastKey == "Control" && event.key == "a") {
      this.selectedForDelete = this.selectedFiles;
      this.selectedFiles.forEach((file) => {
        file.isSelected = true;
      });
      event.stopImmediatePropagation();
    }
    this.lastKey = event.key;
  }

  closeBox() {
    this.dialogRef.close(true);
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  fileClick(file) {

    if (file.progress == 100) {
      if (this.selectedForDelete.indexOf(file) > 0)
        this.selectedForDelete.splice(this.selectedForDelete.indexOf(file), 1);
      file.isSelected = false;
      return;
    }
    else {
      if (file.isSelected) {
        this.selectedForDelete.splice(this.selectedForDelete.indexOf(file), 1);
      }
      else {
        this.selectedForDelete.push(file);
      }

      file.isSelected = file.isSelected == null ? true : !file.isSelected;
    }
  }

  /***** Stop the processing video and idle video *********/
  stop() {
    try {
      var idsNotInProgress = [];
      var idsInProgress = [];

      this.selectedForDelete.forEach(element => {
        if (element.progress > 0) {
          idsInProgress.push(element.id);
        }
        else {
          idsNotInProgress.push(element.id);
        }

      });

      var data;
      //confirmation
      if (idsInProgress.length > 0) {
        data = {
          title: 'Are you sure?',
          message: 'Do you want to save the audited data up to now or discard?',
          confirmTitle: 'SAVE',
          cancelTitle: 'DISCARD'

        };
      }
      else if (idsNotInProgress.length > 0 && idsInProgress.length == 0) {
        data = {
          title: 'Are you sure?',
          message: "Press 'Yes' to confirm, 'No' to cancel",
          confirmTitle: 'YES',
          cancelTitle: 'NO'
        };

      }

      const confirmDialog = this.matDialog.open(ConfirmDialogComponent, {
        data: data,
        width: '550px',
      });
      confirmDialog.afterClosed().subscribe(result => {

        if (result) {

          if (idsInProgress.length > 0) {
            //remove id's  in progress and save data
            const deleteData = {
              videos: idsInProgress,
              save: result.data ? true : false
            };
            this.DeleteVideosInProgress(deleteData);
          }

          if (idsNotInProgress.length > 0) {
            //remove id's not in progress
            this.videoUploadProcessServ.DeleteVideos(idsNotInProgress).subscribe(
              data => {
                setTimeout(() => {
                  idsNotInProgress.forEach(element => {
                    var file = this.selectedFiles.filter(x => x.id == element);
                    this.selectedFiles.splice(this.selectedFiles.indexOf(file[0]), 1);
                    this.selectedForDelete.splice(this.selectedForDelete.indexOf(file[0]), 1);
                    this.videoProcessed.setDeletedVideos = element;
                  });

                  this.videoProcessed.setCurrentValueRaw = this.selectedFiles;
                }, 100);
              },
              err => {
                console.log(err);
              }
            );
          }
        }
      });
    } catch (ex) {
      console.warn("stop error: ", ex); throw ex;
    }
    //this.selectedForDelete = [];

  }

  DeleteVideosInProgress(deleteData) {
    try {
      this.videoUploadProcessServ.DeleteVideosInProgress(deleteData).subscribe(
        data => {
          //stopped
          setTimeout(() => {
            deleteData.videos.forEach(element => {
              var file = this.selectedFiles.filter(x => x.id == element);
              this.selectedFiles.splice(this.selectedFiles.indexOf(file[0]), 1);
              this.selectedForDelete.splice(this.selectedForDelete.indexOf(file[0]), 1);
              this.videoProcessed.setDeletedVideos = element;
            });

            this.videoProcessed.setCurrentValueRaw = this.selectedFiles;
          }, 100);
        },
        err => {
          console.log(err);
        }
      );
    } catch (ex) {
      console.warn("DeleteVideosInProgress error: ", ex); throw ex;
    }
  }

  uploadMore() {
    this.closeBox();
    //this.matDialog.open(VideoUploadStep1Component);
  }
}

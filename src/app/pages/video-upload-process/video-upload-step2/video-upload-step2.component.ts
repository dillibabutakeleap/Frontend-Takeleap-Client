import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType } from "@angular/common/http";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/@theme/components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from 'app/@theme/components/alert-dialog/alert-dialog.component';
import { Router } from '@angular/router';

import { AppSettings } from 'app/app-settings';
import { PRINT_SCREEN } from '@angular/cdk/keycodes';
import { formatDate } from '@angular/common';
import { VideoUploadProcessService } from '../shared/video-upload-process.service';
import { VideosDiscardConfirmDialogComponent } from '../components/videos-discard-confirm-dialog/videos-discard-confirm-dialog.component';
import { Observable, Subject } from 'rxjs';
import { SystemErrorDialogComponent } from 'app/@theme/components/system-error-dialog/system-error-dialog.component';
import { User } from 'app/@core/models/user';

@Component({
  selector: 'video-upload-step2',
  templateUrl: './video-upload-step2.component.html',
  styleUrls: ['./video-upload-step2.component.scss']
})
export class VideoUploadStep2Component implements OnInit {
  selectedFiles = [];
  selectedForDelete = [];
  filesUploading = [];
  dayType: string = "";
  assetType: string = "";
  isUploading: boolean = false;
  isDialogOpened: boolean = false;
  currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  totalFileSize: number;
  availableDiskSize: number;
  filesUploadBuffer: number;
  constructor(private dialogRef: MatDialogRef<VideoUploadStep2Component>, private dialog: MatDialog,
    private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    private videoUploadProcessService: VideoUploadProcessService, private user: User) {

    this.isDialogOpened = false;
    this.dayType = data.dayType;
    this.assetType = data.assetType.replace(":", " Assets - ").replace("-", " ");
    if (this.assetType.indexOf("Assets") == -1)
      this.assetType = this.assetType + " Assets";


    this.filesUploadBuffer = this.user.currentUserValue[0].FilesUploadBuffer ? this.user.currentUserValue[0].FilesUploadBuffer : 50;

  }

  ngOnInit(): void {
  }

  dropHandler(ev) {
    try {
      ev.preventDefault();
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        var filearr = new Array();
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
          var file = ev.dataTransfer.items[i];
          if (file.kind === 'file') {
            file = file.getAsFile();
            //this.addFileToArray(file);
            filearr.push(file);
          }
        }
        this.handleFileInput(filearr, null);
      }
      this.handleFileInput(filearr, null);
    }
    catch (ex) {
      console.warn("dropHandler error: ", ex); throw ex;
    }
  }

  addFileToArray(file) {
    try {
      if (file.type.indexOf("video") != -1) {
        var ifExists = this.selectedFiles.filter(x => x.fileName == file.name);
        if (ifExists.length == 0) {
          var totalSizeMB = file.size / Math.pow(1024, 2);
          let obj = {
            fileName: file.name,
            selectedFile: file,
            size: totalSizeMB,
            fileId: file.name,
            uploadCompleted: false,
            isSelected: false,
            uploadProgress: 0,
            isUploading: false,
            aws_user_id: this.user.currentUserValue[0].aws_user_id
          }
          this.selectedFiles.push(obj);
          //this.getFileUploadStatus(obj);
        }

      }
    }
    catch (ex) {
      console.warn("addFileToArray error: ", ex); throw ex;
    }

  }

  dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    ev.stopPropagation();
  }

  fileClick(file) {

    if (file.isSelected) {
      this.selectedForDelete.splice(this.selectedForDelete.indexOf(file), 1);
    }
    else {
      this.selectedForDelete.push(file);
    }

    file.isSelected = !file.isSelected;

  }


  deleteFiles() {
    try {
      if (this.selectedForDelete.length > 0) {
        const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Confirm Delete',
            message: 'Are you sure, you want to remove videos?'
          }
        });
        confirmDialog.afterClosed().subscribe(result => {
          if (result.data === true) {
            for (var i = 0; i < this.selectedForDelete.length; i++) {
              this.selectedFiles.splice(this.selectedFiles.indexOf(this.selectedForDelete[i]), 1);
            }
            this.selectedForDelete = [];
            this.CalculateTotalFileSize();
          }
        });
      }
    }
    catch (ex) {
      console.warn("deleteFiles error: ", ex); throw ex;
    }

  }

  //Get the status of File if it's present or not
  getFileUploadStatus(file) {
    try {
      // fetch the file status on upload
      let headers = new HttpHeaders({
        "size": file.selectedFile.size.toString(),
        "x-file-id": file.fileId,
        'name': file.fileName
      });

      //console.log(headers);

      this.http.get(AppSettings.API_VIDEO_STATUS, { headers: headers }).subscribe(
        (res: any) => {
          console.log(res);
          file.uploadedBytes = res.uploaded;
        }, err => {
          console.log(err);
        }
      )
    }
    catch (ex) {
      console.warn("getFileUploadStatus error: ", ex); throw ex;
    }
  }

  uploadFiles() {
    try {
      if (this.selectedFiles.length == 0) {
        const confirmDialog = this.dialog.open(AlertDialogComponent, {
          data: {
            message: "Please add videos to list for upload."
          }
        });
      }
      else if (this.dayType && this.assetType) {

        this.CalculateTotalFileSize();

        this.ValidateDiskSpace(this.totalFileSize).subscribe(data => {
          // if space exists then only it will move ahead for video status
          if (data) {
            //upload each video
            this.UploadFilesInQueue();
          }
        });

      }
    }
    catch (ex) {
      console.warn("uploadFiles error: ", ex); throw ex;
    }

  }

  UploadFilesInQueue(isCalledAfterUploadCompleted = false) {
    if (this.selectedFiles && this.selectedFiles.length > 0) {

      var filesUploadingCount = this.selectedFiles.filter(x => (x.uploadProgress > 0 && x.uploadProgress < 100) || x.isUploading == true).length;

      if (filesUploadingCount < 5) {
        var pendingFiles = this.selectedFiles.filter(x => x.uploadProgress == 0 && x.isUploading != true);

        if (pendingFiles.length > 0) {
          console.log("pending file ", pendingFiles[0].isUploading);
          const filesInQueue = pendingFiles.length;
          const filesCanBeUploadFromQueue = 5 - filesUploadingCount;
          const counterTill = filesInQueue > filesCanBeUploadFromQueue ? filesCanBeUploadFromQueue : filesInQueue;
          console.log("Counters:", filesInQueue, filesCanBeUploadFromQueue, counterTill);
          for (var i = 0; i < counterTill; i++) {
            var file = pendingFiles[i];
            var fileStatus = this.filesUploading.filter(x => x.fileName == file.fileName);
            if (file.uploadProgress == 0 && fileStatus.length == 0) {
              this.isUploading = true;
              this.filesUploading.push(file);
              this.resumeUpload(file, (isCalledAfterUploadCompleted ? 1 : i));
            }
          }
        }
      }
    }

  }

  closeBox() {
    this.dialogRef.close();
  }

  resumeUpload(file, index) {
    console.log(file, index);
    //make upload call and update the file percentage
    try {
      const headers2 = new HttpHeaders({
        "size": file.selectedFile.size.toString(),
        "x-file-id": file.fileId,
        "day-type": this.dayType,
        "asset-type": this.data.assetType,
        "x-start-byte": "0",//file.uploadedBytes.toString(),
        'name': file.fileName,
        "aws-user-id": file.aws_user_id.toString(),
        "file-index": index.toString(),
      });

      const req = new HttpRequest('POST', AppSettings.API_VIDEO_UPLOAD, file.selectedFile.slice(file.uploadedBytes, file.selectedFile.size + 1), {
        headers: headers2,
        reportProgress: true,
      }
      );

      //return this.http.request(req).toPromise();
      let result = this.http.request(req).
        subscribe(
          (res: any) => {
            //console.log(res);
            if (res.loaded && res.total) {
              var uploadPercent = (res.loaded / res.total) * 100;
              file.uploadProgress = uploadPercent;
            }

            if (res && res.type == 2 && res.status && res.status == 200 && res.statusText && res.statusText == "OK" && file.uploadProgress == 100) {
              this.FileUploadCompleted();
            }

          },
          err => {
            console.log(err)
            throw err;
          }
        );
    }
    catch (ex) {
      console.warn("resumeUpload error: ", ex, file);
    }
  }

  FileUploadCompleted() {

    if (!this.isDialogOpened) {
      this.isDialogOpened = true;
      setTimeout(() => {
        this.dialogRef.close(true);
      }, 200);
    }

    //this.uploadFiles();
    setTimeout(() => {
      this.UploadFilesInQueue(true); // Upload files in queues  
    }, 400);

  }

  openFileDialog() {
    document.getElementById("openFileDialog").click();
  }

  // handle all file inputs either browse or drag
  handleFileInput(files, ctl) {
    try {
      var nameArr = Array();
      var totalFiles = files.length + this.selectedFiles.length;
      if (totalFiles > this.filesUploadBuffer) {
        this.dialog.open(SystemErrorDialogComponent,
          {
            data: {
              message: "You can upload " + (this.filesUploadBuffer - this.selectedFiles.length) + " files more.",
              title: "Maximum " + this.filesUploadBuffer + " Files Allowed"
            }
          });
        return;
      }

      for (var i = 0; i < files.length; i++) {
        this.addFileToArray(files[i]);

        nameArr.push(files[i].name);
      }

      this.CalculateTotalFileSize();

      this.ValidateDiskSpace(this.totalFileSize).subscribe(data => {
        // if space exists then only it will move ahead for video status
        if (data == true) {
          if (nameArr.length > 0) {
            this.HandleVideosStatus(nameArr);
          }
        }
      });

      if (ctl)
        ctl.srcElement.value = null;
    }
    catch (ex) {
      console.warn("handleFileInput error: ", ex); throw ex;
    }
  }

  // receives video names to get it's status from server
  // show pop-up to user in order to ask user to discard video
  HandleVideosStatus(nameArr) {
    try {
      // sending array of video names
      // it will return only those video names which already exists
      this.videoUploadProcessService.GetVideosStatus(nameArr).subscribe(
        data => {
          var dataNames = (data as any);
          // show pop-up
          if (dataNames.length > 0)
            var dialogRef = this.dialog.open(VideosDiscardConfirmDialogComponent, {
              data: dataNames,
              disableClose: true
            });

          dialogRef.afterClosed().subscribe(data => {
            //data.type = 1 or 2
            //if 1 then processanyway
            //if 2 then discard
            if (data.type == 1) {
              data.videos.forEach(element => {
                if (element.selected == false) {
                  var video = this.selectedFiles.filter(x => x.fileName == element.name);
                  if (video.length > 0)
                    this.selectedFiles.splice(this.selectedFiles.indexOf(video[0]), 1);
                }
              });

              //this.uploadFiles();
            }
            else if (data.type = 2) {
              //data.videos = contains all the videos with status of discard
              data.videos.forEach(element => {
                if (element.selected == true) {
                  var video = this.selectedFiles.filter(x => x.fileName == element.name);
                  if (video.length > 0)
                    this.selectedFiles.splice(this.selectedFiles.indexOf(video[0]), 1);
                }
              });
            }
            this.CalculateTotalFileSize();

          });
        }
      )
    }
    catch (ex) {
      console.warn("HandleVIdeoStatus error: ", ex); throw ex;
    }
  }

  //validates Disk space
  ValidateDiskSpace(sizeToCompare): Observable<boolean> {
    try {
      var status = new Subject<boolean>();
      this.videoUploadProcessService.GetAvailableDiskSpace().subscribe(
        data => {
          var res = (data as any);

          let availableSpace = parseFloat(res.available);
          this.availableDiskSize = availableSpace;
          if (availableSpace > sizeToCompare) {
            status.next(true);
          }
          else {
            this.dialog.open(SystemErrorDialogComponent,
              {
                data: {
                  message: "You require " + sizeToCompare.toFixed(2) + " mb space on disk, but you are left with " + availableSpace.toFixed(2) + " mb space only.",
                  title: "Low Disk Space"
                }
              });
            status.next(false);
          }
        }
      );
    }
    catch (ex) {
      console.warn("ValidateDiskSpace error: ", ex); throw ex;
      return null;
    }
    return status.asObservable();
  }

  //Calculate size of all Videos selected
  CalculateTotalFileSize() {
    this.totalFileSize = 0;
    if (this.selectedFiles)
      this.selectedFiles.forEach(element => {
        this.totalFileSize += element.size;
      });
  }

}

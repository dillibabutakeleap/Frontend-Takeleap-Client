import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from 'app/@theme/components/alert-dialog/alert-dialog.component';


@Component({
  selector: 'video-upload-step1',
  templateUrl: './video-upload-step1.component.html',
  styleUrls: ['./video-upload-step1.component.scss']
})
export class VideoUploadStep1Component implements OnInit {

  isDay: boolean = true;
  assetType: string = "";
  linearAssetType: string = "";

  constructor(private dialogRef: MatDialogRef<VideoUploadStep1Component>, private dialog: MatDialog) { }

  ngOnInit(): void {
    //this.isDay = true;
  }

  changeDay(type) {
    this.isDay = type;//!this.isDay;
    this.assetType = "";
    this.linearAssetType = "";
  }

  nextStep() {

    if (this.assetType == "") {
      this.dialog.open(AlertDialogComponent, {
        data: {
          message: "Please select an asset to proceed."
        }
      });
    }
    else if (this.assetType == "linear" && this.linearAssetType == "") {
      this.dialog.open(AlertDialogComponent, {
        data: {
          message: "Please select linear asset to proceed."
        }
      });
    }
    else {
      //this.dialogRef.close();
      if (this.assetType != "linear") { this.linearAssetType = ""; }

      this.dialogRef.close({
        dayType: this.isDay ? 'day' : 'night',
        assetType: this.linearAssetType != "" ? this.assetType + ":" + this.linearAssetType : this.assetType
      });
    }


  }
  close() {
    this.dialogRef.close();
  }
  // asset(type){
  //   this.assetType = type;
  // }

}

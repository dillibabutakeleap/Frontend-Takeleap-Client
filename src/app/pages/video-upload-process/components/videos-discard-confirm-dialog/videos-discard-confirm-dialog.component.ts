import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'videos-discard-confirm-dialog',
  templateUrl: './videos-discard-confirm-dialog.component.html',
  styleUrls: ['./videos-discard-confirm-dialog.component.scss']
})
export class VideosDiscardConfirmDialogComponent implements OnInit {

  videoNames = Array();
  constructor(private dialogRef:MatDialogRef<VideosDiscardConfirmDialogComponent>,@Inject(MAT_DIALOG_DATA)public data:any) { }

  ngOnInit(): void {

    this.data.forEach(element => {
      this.videoNames.push({
        name:element,
        selected:true
      });
    });
  }
  Process(){
    console.log(this.videoNames);
    this.dialogRef.close({
      "type" : 1,//proceedanyway
      "videos" : this.videoNames
    });
  }

  Discard(){
    this.dialogRef.close({
      "type" : 2,//discard
      "videos" : this.videoNames
    });
  }
  ChangeStatus(file){
    file.selected = !file.selected;
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'system-error-dialog',
  templateUrl: './system-error-dialog.component.html',
  styleUrls: ['./system-error-dialog.component.scss']
})
export class SystemErrorDialogComponent implements OnInit {

  title: string;
  message: string;
  confirmTitle: string;
  closeTitle: string;

  constructor(private dialogRef: MatDialogRef<SystemErrorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.title = this.data.title;
    this.message = this.data.message;

    //console.log(this.title, this.message);

    if (this.data.confirmTitle) {
      this.confirmTitle = this.data.confirmTitle;
    }

    if (this.data.closeTitle) {
      this.closeTitle = this.data.closeTitle;
    }
    else {
      this.closeTitle = "Close";
    }
  }

  Discard() {
    this.dialogRef.close(false);
  }

  Process() {
    this.dialogRef.close(true);
  }

}

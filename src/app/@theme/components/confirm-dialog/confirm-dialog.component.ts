import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  message: string;
  confirmTitle:string;
  cancelTitle:string;
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,@Inject(MAT_DIALOG_DATA)public data:any) { 
    
  }

  ngOnInit(): void {
    if(!this.data.confirmTitle){
      this.data.confirmTitle="Confirm";
    }
    if(!this.data.cancelTitle){
      this.data.cancelTitle="Cancel";
    }
  }

  confirm(status){
    this.dialogRef.close({'data':status});
  }

}

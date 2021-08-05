import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'export-to-pdf-dialog',
  templateUrl: './export-to-pdf-dialog.component.html',
  styleUrls: ['./export-to-pdf-dialog.component.scss']
})
export class ExportToPdfDialogComponent implements OnInit {

  title: string;

  constructor(public dialogRef: MatDialogRef<ExportToPdfDialogComponent>,@Inject(MAT_DIALOG_DATA)public data:any) { }


  ngOnInit(): void {
    
    this.title =  this.data.title;
  }

  confirm(status){
    this.dialogRef.close({'data':status});
  }
}

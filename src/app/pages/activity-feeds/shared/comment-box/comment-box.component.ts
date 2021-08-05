import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent implements OnInit {
  comment:string;
  constructor(private dialogRef:MatDialogRef<CommentBoxComponent>,@Inject(MAT_DIALOG_DATA) public data) { 
    this.comment = data.comment;
  }

  ngOnInit(): void {
  }
  
  closeBox(){
    this.dialogRef.close();
  }
  save(){
    this.dialogRef.close(this.comment);
  }
}

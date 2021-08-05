import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { DatePipe, formatDate } from '@angular/common';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, HostListener, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { COSMIC_THEME } from '@nebular/theme';
import { AlertDialogComponent } from 'app/@theme/components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from 'app/@theme/components/confirm-dialog/confirm-dialog.component';
import { AppSettings } from 'app/app-settings';

import { delay } from 'rxjs/operators';
import { ImagePreviewComponent } from '../../image-preview/image-preview.component';
import { ActivityFeedsService } from '../activity-feeds.service';
import { CommentBoxComponent } from '../comment-box/comment-box.component';



@Component({
  selector: 'feed-dynamic-content',
  templateUrl: './feed-dynamic-content.component.html',
  styleUrls: ['./feed-dynamic-content.component.scss'],
  animations: [
    trigger('anim', [
      state('active', style({ opacity: 1 })),
      state('closed', style({ opacity: 0, height: '0' })),
      transition('active => closed',
        animate(600, style({ opacity: 0 }))
      ),

      transition(':enter', [
        style({ opacity: 1 }),
        animate(200)
      ]),


    ])
  ]
})
export class FeedDynamicContentComponent implements OnInit {
  //@Input() historyDate:string;
  @Input() anomalies: any;
  @Input() tabIndex: number;
  @Input() selectedTabIndex: number;
  @Input() totalAnomalyCount: number;
  @Input() historyDates: any[];
  @Output() scrollEnd = new EventEmitter();
  @Output() sortByDateAsc = new EventEmitter<boolean>();
  anomaliesCopy: any;
  length: 0;
  domEles;
  selectedAnomalyIndex: number = 0;
  lastArrowKey: string;
  keyBoardEvent: KeyboardEvent;
  myInnerHeight: any;
  isDialogBoxOpen: boolean = false;
  isMatMenuOpen: boolean = false;
  issortByDateAsc: boolean = false;
  dialogRef: any;
  pageSize = AppSettings.ANOMALIESPAGESIZE; //default page size is kept to 50 for anomaly results 

  constructor(private dialog: MatDialog, private activityFeedsService: ActivityFeedsService,
    private datePipe: DatePipe, private _DomSanitizationService: DomSanitizer) {

    this.myInnerHeight = window.innerHeight - 200;
  }

  ngOnInit(): void {

    // this.selectedAnomalyIndex = 0;

    // if (this.anomalies.length > 0) {
    //   this.anomaliesCopy = this.anomalies == null ? JSON.parse('[]') : JSON.parse(JSON.stringify(this.anomalies));
    //   this.anomalies[0].isSelected = true;
    // }

  }

  ngOnChanges(changes) {
    if (changes.selectedTabIndex && changes.selectedTabIndex != undefined) {
      //console.log(changes);
      if (this.anomalies.length > 0) {
        this.anomalies[0].isSelected = false;
        this.anomaliesCopy = this.anomalies == null ? JSON.parse('[]') : JSON.parse(JSON.stringify(this.anomalies));
        this.anomalies[0].isSelected = true;
      }
      this.length = 0;
      this.selectedAnomalyIndex = 0;
      this.lastArrowKey = "";

      this.isDialogBoxOpen = false;
      this.isMatMenuOpen = false;
    }
    else {
      this.anomaliesCopy = this.anomalies == null ? JSON.parse('[]') : JSON.parse(JSON.stringify(this.anomalies));
      this.anomaliesCopy[this.selectedAnomalyIndex].isSelected = false;
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    // return if comment box is opened.
    if (this.isDialogBoxOpen)
      return;

    //to stop all actions if user selected tab is not same.
    if (this.selectedTabIndex != this.tabIndex || this.anomalies == null || this.anomalies.length == 0) {
      event.stopImmediatePropagation();
      return;
    }
    var path = event.path || (event.composedPath && event.composedPath());
    try {
      if (path[0].className != null && (path[0].className.indexOf('col') != -1 || path[0].className.indexOf('mat-slider') != -1
        || path[0].className.indexOf('mat-menu') != -1 || path[0].id.indexOf('anomaly') != -1
        || path[0].className.indexOf('lbl') != -1 || path[0].className.indexOf('comment') != -1
        || path[0].className.indexOf('submit') != -1 || path[0].className.indexOf('btn') != -1
      )) {
        return;
      }
      else {
        this.resetCurrentAnomaly();
        this.RowSelected(this.anomalies[this.selectedAnomalyIndex]);
      }
    } catch (error) {
      console.log(error);
      return;
    }


  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (this.selectedTabIndex != this.tabIndex || (document.activeElement.attributes['type'] && document.activeElement.attributes['type'].value == "text") || event.code == "TAB")
      return;

    // var path = event.path || (event.composedPath && event.composedPath());

    // if (path[0].className != null ) {
    //   return;
    // }

    this.keyBoardEvent = event;
    let anomaly = this.anomalies[this.selectedAnomalyIndex];

    if (event.key == "Escape") {
      if (this.lastArrowKey != "Escape") {
        anomaly.Audit_status = null;
        this.KeyPressedUpDown(event.key);
        this.lastArrowKey = event.key;
      }
      return;
    }
    else if (this.isDialogBoxOpen)
      return;
    else if (event.code == "Space") {
      event.stopImmediatePropagation();
      this.magnifyImages(this.anomalies[this.selectedAnomalyIndex]);
      return;
    }

    if (document.activeElement.tagName != "MAT-SLIDER" && event.key != "Enter") {
      document.getElementById("anomaly-" + this.tabIndex + '-' + this.selectedAnomalyIndex).focus();
      return;
    }


    if (event.key.indexOf("ArrowDown") !== -1) {
      event.stopImmediatePropagation();
      if ((this.selectedAnomalyIndex + 1) < this.anomalies.length)
        this.KeyPressedUpDown(event.key);
      else {
        this.resetCurrentAnomaly();
        this.RowSelected(this.anomalies[this.selectedAnomalyIndex]);
        return;
      }

    }
    else if (event.key.indexOf("ArrowUp") !== -1) {
      if ((this.selectedAnomalyIndex - 1) >= 0)
        this.KeyPressedUpDown(event.key);
      else {
        this.resetCurrentAnomaly();
        this.RowSelected(this.anomalies[this.selectedAnomalyIndex]);
        return;
      }
    }
    else if (event.key.indexOf("ArrowRight") !== -1) {
      this.KeyPressedLeftRight(event.key);
    }
    else if (event.key.indexOf("ArrowLeft") !== -1) {
      this.KeyPressedLeftRight(event.key);
    }
    else if (parseInt(event.key) && (this.lastArrowKey == "ArrowRight" || this.lastArrowKey == "ArrowLeft")) {

      switch (this.lastArrowKey) {
        case "ArrowRight":
          switch (event.key) {
            case "1":
              anomaly.Audit_value = 'vehicle occlusion';
              break;
            // case "2":
            //   anomaly.Audit_value = 'plant overgrown';
            //   break;
            case "2":
              anomaly.Audit_value = 'low light condition';
              break;
            case "3":
              anomaly.Audit_value = 'image mismatch';
              break;
            case "4":
              anomaly.Audit_value = 'others';
              break;
          }
          break;
        case "ArrowLeft":
          switch (event.key) {
            case "1":
              anomaly.Audit_value = 'bent';
              break;
            case "2":
              anomaly.Audit_value = 'broken';
              break;
            case "3":
              anomaly.Audit_value = 'missing';
              break;
            case "4":
              anomaly.Audit_value = 'plant overgrown';
              break;
            case "5":
              anomaly.Audit_value = 'others';
              break;
          }
          break;
      }
      document.getElementById("anomalyStatus-" + this.tabIndex + "-" + this.selectedAnomalyIndex).click();
    }
    else if (event.key == "Enter" && this.lastArrowKey != "Enter") {
      this.submitAnomaly(anomaly);
      this.lastArrowKey = event.key;
    }



  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    if (event.target.scrollHeight - (event.target.offsetHeight + event.target.scrollTop) < 1 || (event.target.offsetHeight + event.target.scrollTop) >= event.target.scrollHeight) {
      this.scrollEnd.next(); //calling up global feed to load next page data
    }
  }

  RowSelected(anomaly) {
    //debugger;
    //this.resetCurrentAnomaly();
    if (this.anomalies[this.selectedAnomalyIndex] != anomaly) {
      this.resetCurrentAnomaly();
      anomaly.isSelected = true;
      this.selectedAnomalyIndex = this.anomalies.indexOf(anomaly);
      document.getElementById("anomaly-" + this.tabIndex + "-" + this.selectedAnomalyIndex).focus();
    }
    else {
      anomaly.isSelected = true;
      this.selectedAnomalyIndex = this.anomalies.indexOf(anomaly);
      document.getElementById("anomaly-" + this.tabIndex + "-" + this.selectedAnomalyIndex).focus();
    }
  }

  MenuClosed() {
    this.isMatMenuOpen = false;
  }

  KeyPressedLeftRight(key) {
    //debugger;
    this.lastArrowKey = key;
    var anomaly = this.anomalies[this.selectedAnomalyIndex];

    if (anomaly.anomaly_status_slider == 50) {
      this.lastArrowKey = "";
      if (anomaly.Audit_status != null) {
        anomaly.Audit_status = null;
        anomaly.Audit_value = "";
        if (this.isMatMenuOpen == true) {
          document.getElementById("anomalyStatus-" + this.tabIndex + "-" + this.selectedAnomalyIndex).click();
        }
        document.getElementById("anomaly-" + this.tabIndex + "-" + this.selectedAnomalyIndex).focus();
        return;
      }
      else
        return;
    }
    else if (anomaly.anomaly_status_slider == 100) {
      anomaly.Audit_status = false;
      this.lastArrowKey = "ArrowRight";
    }
    else if (anomaly.anomaly_status_slider == 0) {
      anomaly.Audit_status = true;
      this.lastArrowKey = "ArrowLeft";
    }
    this.isMatMenuOpen = true;
    document.getElementById("anomalyStatus-" + this.tabIndex + "-" + this.selectedAnomalyIndex).click();
    document.getElementById("anomaly-" + this.tabIndex + "-" + this.selectedAnomalyIndex).focus();
  }

  KeyPressedUpDown(key) {
    let anomaly = this.anomalies[this.selectedAnomalyIndex];
    this.lastArrowKey = "";

    anomaly.isSelected = false;

    //resetting the row
    this.resetCurrentAnomaly();

    if (key == "ArrowDown") {
      this.selectedAnomalyIndex = this.selectedAnomalyIndex + 1;
    }
    else if (key == "ArrowUp") {
      this.selectedAnomalyIndex = this.selectedAnomalyIndex - 1;
    }
    // else if(key == "Escape"){
    //   //do nothing 
    // }
    anomaly = this.anomalies[this.selectedAnomalyIndex];
    anomaly.isSelected = true;
    document.getElementById("anomaly-" + this.tabIndex + '-' + this.selectedAnomalyIndex).focus();

  }

  //reset the state of anomaly when focus changes from one anomaly to another
  resetCurrentAnomaly() {
    this.anomalies[this.selectedAnomalyIndex] = Object.assign({}, this.anomaliesCopy[this.selectedAnomalyIndex]);
  }

  onCheckSubmitChange($event, anomaly) {
    this.submitAnomaly(anomaly, $event);
    if (anomaly.IsAudited)
      $event.srcElement.checked = anomaly.IsAudited;

  }

  //send the request to API to save anomly in the db
  submitAnomaly(anomaly, event = null) {

    this.lastArrowKey = "";
    if (anomaly.Audit_status == null || !anomaly.Audit_value) {
      const dialog = this.dialog.open(AlertDialogComponent, {
        data: {
          message: 'Please audit anomaly before submit.'
        }
      });

      dialog.afterClosed().subscribe(result => {
        if (event != null)
          event.srcElement.checked = anomaly.IsAudited;
      });
    }
    else {

      this.isDialogBoxOpen = true;
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirm Submit',
          message: 'Are you sure to submit?'
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        this.isDialogBoxOpen = false;

        if (result.data === true) {
          console.log(anomaly);
          //submit anomaly to server
          this.activityFeedsService.updateAnomaly(anomaly).subscribe(data => {

            let currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            //add today's date to history list
            if (this.historyDates != null) {
              var existingDate = this.historyDates.filter(x => this.datePipe.transform(x.audited_on, 'yyyy-MM-dd') == currentDate);
              if (existingDate.length == 0) {
                var newHistory = {
                  audited_on: currentDate
                };
                this.historyDates.unshift(newHistory);
              }
            }


            if (anomaly.Audited_on == null || anomaly.Audited_on.indexOf('0000-00-00') > -1 || this.datePipe.transform(anomaly.Audited_on, 'yyyy-MM-dd') != currentDate) {
              //removing audited item from array 
              anomaly.animation = "closed";

              setTimeout(() => {
                this.anomalies.splice(this.anomalies.indexOf(anomaly), 1);
                this.anomaliesCopy = JSON.parse(JSON.stringify(this.anomalies));
                this.RowSelected(this.anomalies[this.selectedAnomalyIndex]);
                this.totalAnomalyCount = this.totalAnomalyCount - 1;
                if (this.anomalies.length < this.pageSize && this.totalAnomalyCount > this.pageSize) {
                  console.log('next page called');

                  this.scrollEnd.next();//calling up global feed to load next page data
                }

              }, 500);

            }
            else {
              anomaly.Audited_on = currentDate;
              this.anomaliesCopy[this.selectedAnomalyIndex] = Object.assign({}, anomaly);
              this.anomaliesCopy[this.selectedAnomalyIndex].isSelected = false;

              this.dialog.open(AlertDialogComponent, {
                data: {
                  message: 'Audit submitted successfully.'
                }
              });
            }



          },
            error => {
              console.log(error);
              if (event != null)
                event.srcElement.checked = anomaly.IsAudited;
            }
          );

        }
        else {
          if (event != null)
            event.srcElement.checked = anomaly.IsAudited;
        }


      });

    }


  }


  //click on magnify image icon
  magnifyImages(anomaly) {
    if (anomaly) {
      if (!this.isDialogBoxOpen) {

        this.isDialogBoxOpen = true;

        this.dialogRef = this.dialog.open(ImagePreviewComponent, {
          data: {
            master: anomaly.Frame_Master,
            anomaly: anomaly.images
          }
        });

      }
      else {
        this.isDialogBoxOpen = false;
        this.dialogRef.close();
      }

      this.dialogRef.afterClosed().subscribe((data) => {
        this.isDialogBoxOpen = false;
        if (data) {
          this.anomalies[this.selectedAnomalyIndex].images = data;
          this.anomalies[this.selectedAnomalyIndex].Frame_Test = data.filter(x => x.selected == true)[0].src;
        }
      });
    }
  }

  statusClick(index) {
    if (this.anomalies[index].anomaly_status_slider == 50) {
      document.getElementById("anomalyStatus-" + this.tabIndex + "-" + index).click();
      //this.isMatMenuOpen = false;
    }
  }

  //comment link clicked
  comment(anomaly) {
    var dialogRef = this.dialog.open(CommentBoxComponent, {
      data: { comment: anomaly.Comments }
    });
    this.isDialogBoxOpen = true;
    dialogRef.afterClosed().subscribe(txtComment => {
      this.isDialogBoxOpen = false;
      if (txtComment != undefined) {
        anomaly.Comments = txtComment;
      }
    });
  }

  sliderChange(event, anomaly) {

    this.RowSelected(anomaly);
    this.KeyPressedLeftRight("mouseclicked");
  }

  audit_value_changed(event) {
    this.anomalies[this.selectedAnomalyIndex].Audit_value = event.srcElement.value.replace(/_/gi, " ");
  }

  sortByDate() {
    if (this.issortByDateAsc) {
      this.issortByDateAsc = false;
    }
    else {
      this.issortByDateAsc = true;
    }

    this.sortByDateAsc.emit(this.issortByDateAsc);
  }

}

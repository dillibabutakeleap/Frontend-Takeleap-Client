import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VideoUploadStep3Component } from 'app/pages/video-upload-process/video-upload-step3/video-upload-step3.component';
import { ActivityFeedsService } from '../shared/activity-feeds.service';

import { VideosProcessed } from 'app/@core/models/videos-processed';
import { ExportToPdfDialogComponent } from 'app/@theme/components/export-to-pdf-dialog/export-to-pdf-dialog.component';
import { ExportToCsv } from 'export-to-csv';
import { AppSettings } from 'app/app-settings';
import { BehaviorSubject } from 'rxjs';
import { BellNotifications } from 'app/@core/models/bell-notifications';
import { NotificationService } from 'app/@core/services/notification.service';
import { parseJsonText } from 'typescript';
import { readJSON } from '@nebular/theme/schematics/util';

declare var require: any
const FileSaver = require('file-saver');


@Component({
  selector: 'global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss']
})
export class GlobalFeedComponent implements OnInit {
  length: 0;
  domEles;
  selectedAnomalyIndex: number = 0;
  lastArrowKey: string;
  keyBoardEvent: KeyboardEvent;
  anomalies: any;
  myInnerHeight: any;
  isCommentOpen: boolean = false;
  isMatMenuOpen: boolean = false;
  selectedTabIndex: number = -1;
  prevSelectedTabIndex: number = -1;
  tabs: Array<any> = [];
  selectedAssets: Array<Number> = [];
  historyDates: any;
  assets: any;
  filter_from_date;
  filter_till_date;
  filter_from_chainage;
  filter_till_chainage;
  activeTab;
  completedFileUploadsCount = 0;
  pageSize = AppSettings.ANOMALIESPAGESIZE; //default page size is kept to 50 for anomaly results 

  notifications: Array<BellNotifications> = [];
  notificationsUnseenCount: number = 0;

  constructor(@Inject(ElementRef) private element: ElementRef, private dialog: MatDialog,
    private activityFeedsService: ActivityFeedsService, private videoProcessed: VideosProcessed,
    private bellNotifications: BellNotifications) {

    this.myInnerHeight = window.innerHeight - 200;

    this.loadAssets();

    this.loadHistoryDates();

    bellNotifications.getCurrentVal.subscribe(
      (data: BellNotifications[]) => {
        this.notifications = data;//bellNotifications.bellNotifications.value;
        this.notificationsUnseenCount = data.filter(x => x.is_viewed == false).length;
      }
    );

  }

  ngOnInit(): void {
    this.domEles = document.querySelectorAll('#anomalies > *');
    this.length = this.domEles.length;
    this.videoProcessed.current.subscribe(data => {
      setTimeout(() => {
        if (data.length > 0) {
          var filtrvideos = data.filter(x => x.progress >= 99 && x.progress <= 100);
          if (this.completedFileUploadsCount < filtrvideos.length) {
            //refresh data as one video upload completed
            this.openHistory("Unaudited");
            this.completedFileUploadsCount = filtrvideos.length;
            console.log("reloaded");
          }
        }
        else {
          if (this.completedFileUploadsCount > 0) {
            //refresh data as all video upload completed
            this.openHistory("Unaudited");
            console.log("reloaded");
          }
          this.completedFileUploadsCount = 0;
        }
      }, 200);
    });
  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    console.log(event);
    //  if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
    //   console.log("End");
    // }
  }

  //Get's all the history dates from API
  loadHistoryDates() {
    this.activityFeedsService.getHistoryDates().subscribe(data => {
      this.historyDates = data;
    });
  }

  //Load all assets to display in filter area
  loadAssets() {
    this.activityFeedsService.getAssets().subscribe(
      data => {
        this.assets = data;
        this.assets.unshift(
          {
            "id": 0,
            "name": "Select All",
            "checked": false
          }
        );

        for (var i = 0; i < this.assets.length; i++) {
          this.assets[i].checked = false;
        }

        this.openHistory(); //// open current anomalies if date is null

      },
      error => {
        console.log(error);

      }
    );
  }

  //Load all notifications
  loadNotifications() {
    this.activityFeedsService.getNotifications().subscribe(
      (data: BellNotifications[]) => {
        //data = data as any;
        //console.log(data);
        this.bellNotifications.currentValue = data;
      },
      error => {
        console.log(error);

      }
    );
  }

  handleNotificationIconClicked() {
    if (this.notificationsUnseenCount > 0) {
      this.activityFeedsService.markNotificationsViewed().subscribe(
        (data: BellNotifications[]) => {
          this.bellNotifications.currentValue = data;  //next(data as any);
        },
        error => {
          console.log(error);

        }
      );
    }
  }

  handleNotificationDelete(id: number) {

    this.activityFeedsService.markNotificationDeleted(id).subscribe(
      (data: BellNotifications[]) => {
        this.bellNotifications.currentValue = data;  //next(data as any);
      },
      error => {
        console.log(error);

      }
    );
  }

  closeTab(index) {
    this.tabs.splice(index, 1);
  }

  filterAssetSelected(asset) {
    if (asset.id == "0") {

      this.tabs[this.prevSelectedTabIndex - 1].filters.assets.forEach(element => {
        element.checked = asset.checked;;
      });
    }

  }

  formatAssetName(name) {
    return name.replace(/_/gi, " ");
  }

  //PageNo 0 means first page
  openHistory(date = null, Filter = null, pageNo = 0) {
    var date_exists = this.tabs.filter(ele => {
      return ele.date == date;
    });

    date = date == "Unaudited" ? "" : date;
    var fromDate, tillDate, fromChainage, toChainage, selectedAssets = "", sortByDateAsc;
    if (Filter != null) {
      fromDate = Filter.fromDate ? Filter.fromDate : "";
      tillDate = Filter.tillDate ? Filter.tillDate : "";
      fromChainage = Filter.fromChainage ? Filter.fromChainage : "";
      toChainage = Filter.toChainage ? Filter.toChainage : "";
      selectedAssets = "";
      sortByDateAsc = Filter.sortByDateAsc ? Filter.sortByDateAsc : "false";
      Filter.assets.forEach(element => {
        if (element.checked) {
          selectedAssets += element.name + ",";
        }
      });
    }

    if (date == null || date == "Unaudited") {
      date = "";
    }

    this.activityFeedsService.getHistory(date, fromDate, tillDate, fromChainage, toChainage, selectedAssets, pageNo, this.pageSize, sortByDateAsc).subscribe(
      data => {
        //debugger;
        //data contains anomalies array and total count

        var totalAnomalyCount = (data as any).count;
        var anomalies = (data as any).anomalies;
        for (var i = 0; i < anomalies.length; i++) {
          anomalies[i].anomaly_status_slider = anomalies[i].Audit_status ? 0 : 100;
          anomalies[i].previous_anomaly_status_slider = anomalies[i].anomaly_status_slider;
          anomalies[i].isSelected = false;
          anomalies[i].animation = "active";
          anomalies[i].Audit_status = date == "" ? null : anomalies[i].Audit_status;
          anomalies[i].anomaly_status_slider = date == "" ? 50 : anomalies[i].anomaly_status_slider;
          anomalies[i].previous_anomaly_status_slider = date == "" ? 50 : anomalies[i].previous_anomaly_status_slider;
          var re = /_/gi;

          anomalies[i].Asset = anomalies[i].Asset.replace(re, " ").replace("Signboard", "");
          anomalies[i].Created_on = formatDate(anomalies[i].Created_on, "dd-MM-yyyy H:mm:s", "en-US");
        }

        if (date_exists.length > 0) {
          var date_exists_index = this.tabs.indexOf(date_exists[0]);
          if ((date_exists_index + 1) != this.prevSelectedTabIndex) {
            this.selectedTabIndex = date_exists_index + 1;
            this.prevSelectedTabIndex = this.selectedTabIndex;
          }

          if (pageNo > 0) {
            anomalies = this.tabs[date_exists_index].anomalies.concat(anomalies);
          }
          else {
            this.tabs[date_exists_index].anomalies = [];
          }
          this.tabs[date_exists_index].anomalies = anomalies;
          this.tabs[date_exists_index].totalAnomalyCount = totalAnomalyCount;
        }
        else {
          this.pushToTabs(date, anomalies, totalAnomalyCount);
        }

      },
      error => {
        console.log(error);
      }
    );

  }

  onTabChanged(event) {
    if ((this.selectedTabIndex + 1) != this.prevSelectedTabIndex) {
      this.prevSelectedTabIndex = (event.index + 1);
      console.log(this.prevSelectedTabIndex);
      var date = event.tab.textLabel;
      this.openHistory(date, this.tabs[event.index].filters);
    }

  }

  openVideoProgressDialog() {

    this.dialog.open(VideoUploadStep3Component, {
      width: '100%'
    });

  }

  applyFilter() {
    this.tabs[this.prevSelectedTabIndex - 1].finalFilters = JSON.parse(JSON.stringify(this.tabs[this.prevSelectedTabIndex - 1].filters));
    this.openHistory(this.tabs[this.prevSelectedTabIndex - 1].date, this.tabs[this.prevSelectedTabIndex - 1].filters);

  }

  pushToTabs(date, anomalies, totalAnomalyCount) {
    //console.log(anomalies);
    date == "" ? "Unaudited" : date;
    var date_exists = this.tabs.filter(ele => {
      return ele.date == date;
    });

    if (date_exists.length > 0) {
      var date_exists_index = this.tabs.indexOf(date_exists[0]);
      if ((date_exists_index + 1) != this.prevSelectedTabIndex) {
        this.selectedTabIndex = date_exists_index + 1;
        this.prevSelectedTabIndex = this.selectedTabIndex;
      }

      this.tabs[date_exists_index].anomalies = [];
      this.tabs[date_exists_index].anomalies = anomalies;
    }

    else {
      var filters = {
        fromDate: null,
        tillDate: null,
        fromChainage: null,
        toChainage: null,
        sortByDateAsc: false,
        assets: JSON.parse(JSON.stringify(this.assets))
      };

      this.tabs.push({
        date: date == "" ? "Unaudited" : date,
        anomalies: anomalies,
        filters: filters,
        finalFilters: JSON.parse(JSON.stringify(filters)),
        totalAnomalyCount: totalAnomalyCount
      });

      // always behave little differently
      // we have to set index starting from 1, instead of using 0,1
      // whereas on tabChange it changes functionality to 0,1
      this.selectedTabIndex = this.tabs.length;
      this.prevSelectedTabIndex = this.tabs.length;
    }
  }

  Export(anomalyStatus, type) {

    var fromDate, tillDate, fromChainage, toChainage, selectedAssets = "";
    var Filter = this.tabs[this.prevSelectedTabIndex - 1].filters;
    if (Filter != null) {
      fromDate = Filter.fromDate ? Filter.fromDate : "";
      tillDate = Filter.tillDate ? Filter.tillDate : "";
      fromChainage = Filter.fromChainage ? Filter.fromChainage : "";
      toChainage = Filter.toChainage ? Filter.toChainage : "";
      selectedAssets = "";
      Filter.assets.forEach(element => {
        if (element.checked) {
          selectedAssets += element.name + ",";
        }
      });
    }

    this.activityFeedsService.exportFile(this.tabs[this.selectedTabIndex].date, anomalyStatus, type, fromDate, tillDate, fromChainage, toChainage, selectedAssets).subscribe(data => {

      var result = data as any;
      this.downloadFile(result.data);

    });

    return;

  }

  //used https://www.freakyjolly.com/angular-7-8-9-download-pdf-files-in-browser-instead-of-opening-in-new-tab-quick-solution/ 
  //npm install file-saver
  //to pop-up download file from URL
  downloadFile(fileName) {
    const pdfUrl = './assets/pdf/' + fileName;
    const pdfName = fileName;
    FileSaver.saveAs(pdfUrl, pdfName);
  }

  onAssetSearchChange(val) {
    var filtAssets = this.tabs[this.prevSelectedTabIndex - 1].finalFilters.assets.filter(ele => {
      return this.formatAssetName(ele.name).toLowerCase().indexOf(val.toLowerCase()) >= 0;
    });


    this.tabs[this.prevSelectedTabIndex - 1].filters.assets = JSON.parse(JSON.stringify(filtAssets));
  }

  open_popup_exportToPDF(type) {
    const confirmDialog = this.dialog.open(ExportToPdfDialogComponent, {
      width: '35%',
      data: {
        title: type
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      console.log(result.data);
      this.Export(result.data, type);
    });
  }


  scrollToEnd(event: number) {

    if (this.tabs[event].totalAnomalyCount > this.tabs[event].anomalies.length) {
      var pageNo = this.tabs[event].anomalies.length;
      this.openHistory(this.tabs[event].date, this.tabs[this.prevSelectedTabIndex - 1].filters, pageNo);
    }
  }

  sortByDateAsc(val: boolean, index: number) {
    this.tabs[this.prevSelectedTabIndex - 1].filters.sortByDateAsc = val;
    this.openHistory(this.tabs[index].date, this.tabs[this.prevSelectedTabIndex - 1].filters);

  }



}

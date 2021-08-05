import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'app/@core/services/http.service';
import { AppSettings } from 'app/app-settings';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityFeedsService {

  constructor(private httpService: HttpService) { }

  getAnomalies() {
    return this.httpService.get(AppSettings.API_ANOMALIES).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

  //anomalyStatus = all, true, false
  exportFile(date, anomalyStatus, exportType, fromDate, tillDate, fromChainage, toChainage, selectedAssets) {
    var params = new HttpParams().set("date", date.toString())
      .set("anomalyStatus", anomalyStatus)
      .set("exportType", exportType)
      .set("fromDate", fromDate)
      .set("tillDate", tillDate)
      .set("fromChainage", fromChainage)
      .set("toChainage", toChainage)
      .set("assets", selectedAssets);



    return this.httpService.get(AppSettings.API_ANOMALIES_EXPORTFILE, params).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }



  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

  updateAnomaly(anomaly) {
    return this.httpService.post(AppSettings.API_ANOMALIES, anomaly).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

  getHistory(date, fromDate = "", tillDate = "", fromChainage = "", toChainage = "", assets = "", pageNo = 0, pageSize = 50, sortByDateAsc = false) {

    var params = new HttpParams().set("date", date.toString())
      .set("fromDate", fromDate)
      .set("tillDate", tillDate)
      .set("fromChainage", fromChainage)
      .set("toChainage", toChainage)
      .set("assets", assets)
      .set("pageNo", pageNo.toString())
      .set("pageSize", pageSize.toString())
      .set("sortByDateAsc", "" + sortByDateAsc);

    return this.httpService.get(AppSettings.API_ANOMALIES_History, params).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

  getHistoryDates() {

    return this.httpService.get(AppSettings.API_ANOMALIES_HistoryDates).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

  getAssets() {
    return this.httpService.get(AppSettings.API_ASSET_ALL).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

  getNotifications() {
    return this.httpService.get(AppSettings.API_NOTIFICATION_ALL).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

  markNotificationsViewed() {
    return this.httpService.get(AppSettings.API_NOTIFICATION_VIEWED).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

  markNotificationDeleted(id) {
    var params = new HttpParams().set("id", id.toString());
    return this.httpService.get(AppSettings.API_NOTIFICATION_DELETE, params).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

}

import { Injectable } from '@angular/core';
import { HttpService } from 'app/@core/services/http.service';
import { AppSettings } from 'app/app-settings';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoUploadProcessService {

  constructor(private httpService: HttpService) { }

  public DeleteVideos(idArr) {
    return this.httpService.post(AppSettings.API_VIDEO_DELETE, idArr).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
    //console.log(idArr);
  }

  public DeleteVideosInProgress(idArr) {
    return this.httpService.post(AppSettings.API_VIDEO_DELETE_INPROGRESS, idArr).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
    //console.log(idArr);
  }

  // sending array of video names
  // it will return only those video names which already exists on server
  public GetVideosStatus(nameArr) {
    return this.httpService.post(AppSettings.API_VIDEO_STATUS, nameArr).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

  public UpdateUnProcessedVideos(status) {
    status = { status: status };
    return this.httpService.post(AppSettings.API_VIDEO_UPDATE_UNPROCESSED, status).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }

  public GetAvailableDiskSpace() {
    return this.httpService.get(AppSettings.API_VIDEO_GETDISKSPACE).pipe(
      catchError(this.httpService.handleError.bind(this.httpService))
    );
  }



}

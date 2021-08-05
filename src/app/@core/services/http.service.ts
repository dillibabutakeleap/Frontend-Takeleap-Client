import { Inject, inject, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
//import { User } from '../models';
import { throwError } from 'rxjs';
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { SystemErrorDialogComponent } from 'app/@theme/components/system-error-dialog/system-error-dialog.component';
import { AppModule } from 'app/app.module';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  //,private thisUser:User
  dialogRef;
  appOfflineMessage: string = "Seems one of the sub-application is offline. Please restart the application again.";
  appErrorMessage: string = "OOPS! Something has went wrong. Please refresh the window.";

  public dialog = this.injector.get(MatDialog);
  constructor(public http: HttpClient, protected injector: Injector) {

  }

  public post(url: string, body: any, httpOptions: HttpHeaders = null) {
    return this.http.post(url, body);//, { headers : this.header(httpOptions)});
  }

  public get(url: string, params: HttpParams = null, httpOptions: HttpHeaders = null) {
    //console.log(url);
    return this.http.get(url,
      {
        //headers:this.header(httpOptions),
        params: params
      }
    );
  }

  //  private header(httpHeaders:HttpHeaders) {
  //    var httpOptions = null;
  //    if(httpHeaders == null){
  //       httpOptions =  new HttpHeaders({
  //           'Content-Type':  'application/json',
  //           'Authorization': 'Bearer ' + this.thisUser.currentUserValue.token
  //         });
  //    }
  //    else{
  //     httpOptions = httpHeaders;
  //    }
  //    return httpOptions;
  //}

  public handleError(error: HttpErrorResponse) {


    if (error.status == 0) {
      this.openErrorDialog(this.appOfflineMessage);
    }
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    }
    //else {
    //   // The backend returned an unsuccessful response code.
    //   // The response body may contain clues as to what went wrong,
    //   console.error(
    //     `Backend returned code ${error.status}, ` +
    //     `body was: ${error.error}`);
    // }

    if (error.status == 400) {
      this.openErrorDialog(this.appErrorMessage);
      console.log(error.error.errorMessage);
      return throwError(error.error.errorMessage);
    }
    else {
      this.openErrorDialog(this.appErrorMessage);
      console.log(error.error.errorMessage);
      return throwError(error.message);
    }

  };

  public openErrorDialog(message) {
    if (!this.dialogRef || this.dialogRef.getState() == MatDialogState.CLOSED) {
      this.dialogRef = this.dialog.open(SystemErrorDialogComponent, { data: { "message": message } })
    }
  }
}

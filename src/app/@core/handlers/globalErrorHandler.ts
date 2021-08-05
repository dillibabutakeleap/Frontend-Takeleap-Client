import { ErrorHandler, Injectable } from "@angular/core";
import { HttpService } from "../services/http.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private httpService: HttpService) {

    }

    handleError(error: any): void {
        console.error(error);
        this.httpService.openErrorDialog(this.httpService.appErrorMessage);
        //throw new Error("Method not implemented.");
    }



}
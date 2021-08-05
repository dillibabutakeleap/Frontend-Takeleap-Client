import { Injectable } from '@angular/core';
import { User } from 'app/@core/models/user';
import { HttpService } from 'app/@core/services/http.service';
import { AppSettings } from 'app/app-settings';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpService: HttpService) { }

  login(username, password) {
    const body = {
      username: username,
      password: password
    };
    return this.httpService.post(AppSettings.API_ACCOUNT_LOGIN, body).pipe(
      map(result => Object.assign(new User(), result)),
      catchError(this.httpService.handleError.bind(this.httpService))
    )
  }
}

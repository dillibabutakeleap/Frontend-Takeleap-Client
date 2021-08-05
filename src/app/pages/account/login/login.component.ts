import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/@core/models/user';
import { VideosProcessed } from 'app/@core/models/videos-processed';
import { AccountService } from '../shared/account.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  isInvalid: boolean;

  constructor(private accountSer: AccountService, private router: Router, private user: User, private videoProcessed: VideosProcessed) {
    this.isInvalid = false;
    localStorage.clear();
    if (user.currentUserValue)
      this.router.navigate(['dashboard'], { replaceUrl: true });

  }

  ngOnInit(): void {
    //this.accountSer.message(); 
    localStorage.clear();
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.login();
      // rest of your code
    }
  }
  public login() {
    //console.log(this.username);
    this.isInvalid = false;
    this.accountSer.login(this.username, this.password).subscribe(
      data => {
        //debugger
        this.user.currentUserValue = data;
        this.videoProcessed.currentValue = [];
        //console.log(this.user.currentUserValue);
        this.router.navigate(['dashboard'], { replaceUrl: true });
      },
      error => {
        //console.log(error);
        this.isInvalid = true;
      }
    )
    //this.router.navigate(['dashboard']);
  }

}

import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public connectionStatus = new BehaviorSubject<Boolean>(null);

  constructor(private socket: Socket, private user: User) {

    socket.emit("username", "frontend");

    //check connection every second

    this.checkConnectionStatus();

    if (this.user.currentUserValue != null && this.socket.ioSocket.connected) {
      this.socket.emit("reloadPage", "5");
    }
    this.RefreshEveryFewSeconds();

  }

  /**
   * RefreshEveryFewSeconds
   */
  public RefreshEveryFewSeconds() {
    // setTimeout(() => {
    //   if (this.user.currentUserValue != null && this.socket.ioSocket.connected) {
    //     this.socket.emit("reloadPage", "5");
    //     console.log("reload sent every 10 mints");
    //     this.RefreshEveryFewSeconds();
    //   }
    // }, 600 * 1000);
  }

  /**
   * checkConnectionStatus
   */
  public checkConnectionStatus() {
    setTimeout(() => {
      this.connectionStatus.next(this.socket.ioSocket.connected);
      this.checkConnectionStatus();
    }, 1000);
  }

  public sendMessage(msg: string) {
    this.socket.emit("bellNotification", "1");
  }

  public refreshVideos() {
    this.socket.emit("refresh", "5");
  }

  public getVideos = () => {
    return Observable.create((observer) => {
      this.socket.on('refresh', (message) => {
        //console.log(message);
        message = JSON.parse(message);
        observer.next(message);
      });
      // this.socket.on('delete', (data) => {
      //   observer.next(data);
      // });
    });
  }

  public videoError = () => {
    return Observable.create((observer) => {
      this.socket.on('videoError', (message) => {
        //message = JSON.parse(message);
        observer.next(message);
      });
    });
  }

  public newBellNotification = () => {
    return Observable.create((observer) => {
      this.socket.on('bellNotification', (message) => {
        message = JSON.parse(message);
        observer.next(message);
      });
    });
  }

  public InitVideosUnProcessedAlert = () => {
    return Observable.create((observer) => {
      this.socket.on('frontendvideosUnProcessedAlert', (message) => {
        //message = JSON.parse(message);
        observer.next(message);
      });
    });
  }

  public CheckConnectionStatus = () => {
    return Observable.create((observer) => {
      this.socket.on('connection', (message) => {
        //message = JSON.parse(message);
        observer.next("connection - " + message);
      });
    });
  }

  // public getVideoIntiateStatus = () => {
  //   return Observable.create((observer) => {
  //           this.socket.on('processing', (message) => {
  //             //console.log(message);
  //               message =JSON.parse(message);
  //               observer.next(message);
  //           });

  //   });
  // }


}

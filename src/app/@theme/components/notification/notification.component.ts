import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/@core/services/notification.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private notificationService: NotificationService) { }
  newMessage: string;
  messageList: string[] = [];

  sendMessage() {
    this.newMessage = 'By Yatin';
    this.notificationService.sendMessage(this.newMessage)
    this.newMessage = '';
  }
  ngOnInit() {
    // this.notificationService
    //   .getMessages()
    //   .subscribe((message: string) => {
    //     console.log(message);
    //     this.messageList.push(message);
    //   });
  }

}

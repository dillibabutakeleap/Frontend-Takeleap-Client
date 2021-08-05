import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BellNotifications {

  id: number;
  video_id: number;
  title: string;
  message: string;
  status: boolean;
  is_deleted: boolean;
  is_viewed: boolean;
  created_on: string;
  file_name: string;

  private bellNotifications;

  constructor() {
    this.bellNotifications = new BehaviorSubject<BellNotifications[]>(null);
  }

  public set currentValue(value: BellNotifications[]) {
    this.bellNotifications.next(value);
  }

  public get getCurrentVal() {
    return this.bellNotifications;
  }


}

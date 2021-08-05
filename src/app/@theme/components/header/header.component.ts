import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'app/@core/models/user';
import { BellNotifications } from 'app/@core/models/bell-notifications';
import { ActivityFeedsService } from 'app/pages/activity-feeds/shared/activity-feeds.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: User;
  showNav: boolean = true;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  notifications: Array<BellNotifications> = [];
  notificationsUnseenCount: number = 0;
  myInnerHeight = 250;

  currentTheme = 'default';

  userMenu = [{ title: 'Log out', tag: 'logout' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: User,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router,
    private bellNotifications: BellNotifications,
    private activityFeedsService: ActivityFeedsService,

  ) {

    bellNotifications.getCurrentVal.subscribe(
      (data: BellNotifications[]) => {
        if (data) {
          this.notifications = data;//bellNotifications.bellNotifications.value;
          this.notificationsUnseenCount = data.filter(x => x.is_viewed == false).length;
        }
      }
    );

    this.myInnerHeight = window.innerHeight - 200;

    menuService.onItemClick().subscribe(data => {
      let item = data.item as any;
      if (item.tag == "logout") {
        this.userService.logout();
        window.location.href = "/";
      }
    });
  }

  ngOnInit() {

    this.currentTheme = this.themeService.currentTheme;
    this.user = this.userService.currentUserValue[0];
    //console.log(this.user[0].first_name);
    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    if (this.router.url.indexOf("dashboard") >= 0) {
      this.showNav = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  navigateHome() {
    //this.menuService.navigateHome();
    this.router.navigate(['dashboard']);

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
}

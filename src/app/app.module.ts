/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MatProgressBarModule } from '@angular/material/progress-bar';


import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { AppSettings } from './app-settings';
import { VideosProcessed } from './@core/models/videos-processed';
import { GlobalErrorHandler } from './@core/handlers/GlobalErrorHandler';


//import { PrintFeedComponent } from './page/activity-feeds/shared/print-feed/print-feed.component';
//import { AppSettings } from './app-settings';

const config: SocketIoConfig = { url: AppSettings.SocketURL, options: { query: { username: "frontend" } } };


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    FormsModule,
    MatDialogModule,
    MatTabsModule,
    MatMenuModule,
    MatProgressBarModule,
    SocketIoModule.forRoot(config),

  ],
  //entryComponents:[MatDialogModule],
  bootstrap: [AppComponent],
  exports: [],
  providers: [VideosProcessed, {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler,
  }]
})
export class AppModule {
}

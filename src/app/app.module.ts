import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpModule } from "@angular/http";
import { SQLite } from '@ionic-native/sqlite';

import { RestProvider } from '../providers/rest/rest';
import { DbProvider } from '../providers/db/db';

import { ScannerApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SamplingcasePage } from '../pages/samplingcase/samplingcase';
import { TakeoutlistPage } from '../pages/takeoutlist/takeoutlist';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';



@NgModule({
  declarations: [
    ScannerApp,
    HomePage,
    ListPage,
    LoginPage,
    SamplingcasePage,
    TakeoutlistPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(ScannerApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ScannerApp,
    HomePage,
    ListPage,
    LoginPage,
    SamplingcasePage,
    TakeoutlistPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    DbProvider,
    SQLite
  ]
})
export class AppModule {}

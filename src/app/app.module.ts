import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpModule } from "@angular/http";
import { SQLite } from '@ionic-native/sqlite';
import { QRScanner } from '@ionic-native/qr-scanner';

import { RestProvider } from '../providers/rest/rest';
import { DbProvider } from '../providers/db/db';

import { ScannerApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SamplingcasePage } from '../pages/samplingcase/samplingcase';
import { TakeoutlistPage } from '../pages/takeoutlist/takeoutlist';
import { QrscannerPage } from '../pages/qrscanner/qrscanner';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';



@NgModule({
  declarations: [
    ScannerApp,
    HomePage,
    ListPage,
    LoginPage,
    SamplingcasePage,
    TakeoutlistPage,
    QrscannerPage
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
    TakeoutlistPage,
    QrscannerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    DbProvider,
    SQLite,
    QRScanner
  ]
})
export class AppModule {}

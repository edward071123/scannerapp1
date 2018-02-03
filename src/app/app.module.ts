import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from "@angular/http";
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLite } from '@ionic-native/sqlite';
import { QRScanner } from '@ionic-native/qr-scanner';

import { DatabaseProvider } from '../providers/database/database';
import { RestProvider } from '../providers/rest/rest';

import { ScannerApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SamplingcasePage } from '../pages/samplingcase/samplingcase';
import { TakeinlistPage } from '../pages/takeinlist/takeinlist';
import { TakeoutlistPage } from '../pages/takeoutlist/takeoutlist';
import { QrscannerPage } from '../pages/qrscanner/qrscanner';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    ScannerApp,
    HomePage,
    LoginPage,
    SamplingcasePage,
    TakeinlistPage,
    TakeoutlistPage,
    QrscannerPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(ScannerApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ScannerApp,
    HomePage,
    LoginPage,
    SamplingcasePage,
    TakeinlistPage,
    TakeoutlistPage,
    QrscannerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLitePorter,
    SQLite,
    RestProvider,
    QRScanner,
    DatabaseProvider
  ]
})
export class AppModule {}

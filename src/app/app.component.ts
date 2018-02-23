import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { DatabaseProvider } from './../providers/database/database';

@Component({
  templateUrl: 'app.html'
})
export class ScannerApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    private toastCtrl: ToastController,
    private databaseprovider: DatabaseProvider,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: '案件列表', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  backToLogin() {
    this.nav.setRoot(HomePage);
  }
  logout() {
    //Api Token Logout 
    this.databaseprovider.deleteAccountTakeInList(localStorage.getItem("account"))
      .then((deleteTakeInResult) => {
        if (deleteTakeInResult == 1) {
          return this.databaseprovider.deleteAccountTakeOutList(localStorage.getItem("account"));
        } else {
          this.presentToast("error: 1086");
          throw new Error('break this chain');
        }
      })
      .then((deleteTakeOutResult) => {
        if (deleteTakeOutResult == 1) {
          localStorage.clear();
          setTimeout(() => this.backToLogin(), 1000);
        } else {
          this.presentToast("error: 1086");
          throw new Error('break this chain');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}

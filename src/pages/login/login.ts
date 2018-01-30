import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { RestProvider } from "../../providers/rest/rest";
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  resposeData: any;
  userData = { "account": "", "password": "" };
  constructor(public navCtrl: NavController, public restProvider: RestProvider, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  login() {
    if (this.userData.account && this.userData.password) {
      this.restProvider.login(this.userData).then((result) => {
        this.resposeData = result;
        if (this.resposeData.errno == 0) {
          console.log('login success');
          localStorage.setItem('account', this.userData.account);
          localStorage.setItem('token', this.resposeData.token);
          this.navCtrl.setRoot(HomePage);
        } else {
          console.log(this.resposeData.errmsg);
          this.presentToast("Please give valid username and password");
        }
      }, (err) => {
        console.log("login error");
      });
    }else {
     this.presentToast("Give username and password");
    }

  }
}

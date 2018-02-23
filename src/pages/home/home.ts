import { Component } from '@angular/core';
import { NavController, ToastController} from 'ionic-angular';

import { RestProvider } from "../../providers/rest/rest";
import { LoginPage } from '../login/login';

import { SamplingcasePage } from '../samplingcase/samplingcase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  resposeData: any;
  expenses: any = [];
  userId: any;
  constructor(
    public navCtrl: NavController,
    public restProvider: RestProvider,
    private toastCtrl: ToastController) {
    let userAccount = localStorage.getItem("account");
    this.userId = localStorage.getItem("userId");
    let userToken = localStorage.getItem("token");
    if (!userAccount || !this.userId || !userToken) {
      this.navCtrl.push(LoginPage);
    } else {
      this.getAllData();
    }
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  getAllData() { 
    this.restProvider.allSamplingCaseList(this.userId).then((result) => {
      this.expenses = result;
      //console.log(this.expenses);
    }, (err) => {
      console.log("get Sampling Case error");
    });
  }
  samplingCaseTapped(event, no, name, subname) {
    this.navCtrl.push(SamplingcasePage, {
      itemNo: no,
      itemName: name,
      itemSubName: subname
    });
  }
}

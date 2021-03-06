import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TakeoutlistPage } from '../takeoutlist/takeoutlist';
import { TakeinlistPage } from '../takeinlist/takeinlist';

/**
 * Generated class for the SamplingcasePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-samplingcase',
  templateUrl: 'samplingcase.html',
})
export class SamplingcasePage {

  selectedItemNo: any;
  selectedItemName: any;
  selectedItemSubName: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams);
    let userAccount = localStorage.getItem("account");
    let userToken = localStorage.getItem("token");
    if (!userAccount || !userToken) {
      this.navCtrl.push(LoginPage);
    } else {
      this.selectedItemNo = navParams.get('itemNo');
      this.selectedItemName = navParams.get('itemName');
      this.selectedItemSubName = navParams.get('itemSubName');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SamplingcasePage');
  }
  takeout() {
    this.navCtrl.push(TakeoutlistPage, {
      itemNo: this.selectedItemNo
    });
  }
  takein() {
    this.navCtrl.push(TakeinlistPage, {
      itemNo: this.selectedItemNo
    });
  }
}

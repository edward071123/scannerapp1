import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
/**
 * Generated class for the FinishPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-finish',
  templateUrl: 'finish.html',
})
export class FinishPage {
  getFailureCount: any;
  title: any;
  userAccount: any;
  getType: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userAccount = localStorage.getItem("account");
    this.getType = navParams.get('itemType');
    this.getFailureCount = navParams.get('failureCount');
    if (this.getType == "takeout") {
      this.title = "攜出成功";
    } else { 
      this.title = "攜入成功";
    }
  }

  backHome() { 
    this.navCtrl.setRoot(HomePage);
  }

}

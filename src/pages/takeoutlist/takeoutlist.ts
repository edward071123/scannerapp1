import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TakeoutlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-takeoutlist',
  templateUrl: 'takeoutlist.html',
})
export class TakeoutlistPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TakeoutlistPage');
  }
  qrscanner() { 

  }
  takeoutsend() {

  }

}

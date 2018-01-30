import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { QrscannerPage } from '../qrscanner/qrscanner';
import { HomePage } from '../home/home';

import { RestProvider } from "../../providers/rest/rest";
import { DbProvider } from "../../providers/db/db";
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
  selectedCaseNo: any;
  samplingLists: any = [];
  samplingListsCount: any;
  userAccount: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restProvider: RestProvider,
    public dbProvider: DbProvider,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController) {
    console.log('ionViewDidLoad TakeoutlistPage');
    this.selectedCaseNo = navParams.get('itemNo');
    this.userAccount = localStorage.getItem("account");
  }
  ionViewWillEnter() {
    this.dbProvider.getTakeOutList(this.userAccount, this.selectedCaseNo)
      .then((result) => {
        this.samplingLists = result;
        this.samplingListsCount = this.samplingLists.length;
      })
      .catch(function (error) {
        this.presentToast("發生錯誤 重整畫面中");
        this.ionViewWillEnter();
        console.log(error);
      });
  }
  deleteData(rowId) {
    let confirm = this.alertCtrl.create({
      title: '注意',
      message: '確定刪除?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            confirm.dismiss();
          }
        },
        {
          text: '確定',
          handler: () => {
            this.dbProvider.deleteTakeOutListRow(rowId).then((result) => {
              this.presentToast(result);
              this.ionViewWillEnter();
            }, (error) => {
              console.log(error);
              this.presentToast("攜出清單單項刪除失敗");
            });
          }
        }
      ]
    });
    confirm.present();
  }
  qrscanner() { 
    this.navCtrl.push(QrscannerPage, {
      type: "takeout",
      case: this.selectedCaseNo
    });
  }
  takeoutsend() {
    if (this.samplingListsCount == 0) {
      alert('請先掃描新增攜出型號');
      return false;
    }
    let confirm = this.alertCtrl.create({
      title: '注意',
      message: '確定攜出?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            confirm.dismiss();
          }
        },
        {
          text: '確定',
          handler: () => {
            this.sendSamplingActivity();
          }
        }
      ]
    });
    confirm.present();
  }
  sendSamplingActivity() {

    for (let samplingList of this.samplingLists) {
      this.restProvider.sendSamplingActivity(this.selectedCaseNo, samplingList.samplingno, "take_out")
        .then((sendResult) => {
          return this.dbProvider.deleteTakeOutListRow(samplingList.id);
        })
        .then((deleteResult) => {
          console.log(samplingList.samplingno + " ok!");
        })
        .catch(function (error) {
          console.log(samplingList.samplingno + " 攜出失敗!");
          console.log(error);
        });
      
    }
    alert('攜出成功 將轉跳案件清單');
    this.navCtrl.setRoot(HomePage);
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}

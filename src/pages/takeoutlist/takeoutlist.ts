import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { QrscannerPage } from '../qrscanner/qrscanner';
// import { HomePage } from '../home/home';
import { FinishPage } from '../finish/finish';

import { RestProvider } from "../../providers/rest/rest";
import { DatabaseProvider } from './../../providers/database/database';

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
  getSendResult: any;
  sendCount: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restProvider: RestProvider,
    private databaseprovider: DatabaseProvider,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController) {
    console.log('ionViewDidLoad TakeoutlistPage');
    this.selectedCaseNo = navParams.get('itemNo');
    this.userAccount = localStorage.getItem("account");
  }
  loadSamplingData() {
    this.databaseprovider.getTakeOutList(this.userAccount, this.selectedCaseNo)
      .then(result => {
        this.samplingLists = result;
        this.samplingListsCount = this.samplingLists.length;
        //console.log(this.samplingLists);
      });
  }
  ionViewWillEnter() {
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadSamplingData();
      } 
    })
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
            this.databaseprovider.deleteTakeOutListRow(rowId)
              .then((result) => {
                if (result == 1) {
                  this.presentToast("攜出單項刪除成功");
                  this.ionViewWillEnter();
                }else {
                  this.presentToast("error: 1084");
                  throw new Error('break this chain');
                }
              }, (error) => {
                console.log(error);
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
            confirm.dismiss();
          }
        }
      ]
    });
    confirm.present();
  }
  async sendSamplingActivity() {
    let getFailure = 0;
    this.sendCount = 0;
    for (let samplingList of this.samplingLists) { 
      await this.restProvider.sendSamplingActivity(this.selectedCaseNo, samplingList.samplingno, "take_out")
        .then((sendResult) => {
          this.getSendResult = sendResult;
          let getstatus = this.getSendResult.status;
          let getBody = this.getSendResult._body;
          if (getstatus == 200) {
            getBody = JSON.parse(getBody);
            if (getBody.errno == 0) {
              return this.databaseprovider.deleteTakeOutListRow(samplingList.rowid);
            } else {
              getFailure++;
            }
          } else {
            getFailure++;
          }
        })
        .then((deleteResult) => {
          if (deleteResult == 1) {
            console.log(samplingList.samplingno + " ok!");
          }
        })
        .then(() => {
          this.sendCount++;
          this.goToFinish(getFailure);
        })
    }
  }
  goToFinish(getFailure) {
    if (this.sendCount == this.samplingLists.length) {
      console.log('done');
      this.navCtrl.push(FinishPage, { itemType: "takeout", failureCount: getFailure });
    }
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController  } from 'ionic-angular';

import { QrscannerPage } from '../qrscanner/qrscanner';
import { HomePage } from '../home/home';

import { RestProvider } from "../../providers/rest/rest";
import { DatabaseProvider } from './../../providers/database/database';
/**
 * Generated class for the TakeinlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-takeinlist',
  templateUrl: 'takeinlist.html',
})
export class TakeinlistPage {
  selectedCaseNo: any;
  userAccount: any;
  samplingLists: any = [];
  samplingListsCount: any;
  selectedSamplingLists: any = [];
  selectedSamplingListsCount: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restProvider: RestProvider,
    private databaseprovider: DatabaseProvider,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController) {
    console.log('ionViewDidLoad TakeinlistPage');
    this.selectedCaseNo = navParams.get('itemNo');
    this.userAccount = localStorage.getItem("account");
  }
  loadSamplingData() {
    this.databaseprovider.getTakeInList(this.userAccount, this.selectedCaseNo)
      .then(result => {
        this.selectedSamplingLists = result;
        this.selectedSamplingListsCount = this.selectedSamplingLists.length;
        //console.log(this.samplingLists);
      });
  }
  ionViewWillEnter() {
    this.restProvider.getSamplingActivityList(this.selectedCaseNo, "take_out")
      .then((listResult) => {
        this.samplingLists = listResult;
        this.samplingListsCount = this.samplingLists.length;
        this.databaseprovider.getDatabaseState().subscribe(rdy => {
          if (rdy) {
            this.loadSamplingData();
          }
        })
      })
      .catch(function (error) {
        this.ionViewWillEnter();
        console.log(error);
      });
  }
  qrscanner() {
    this.navCtrl.push(QrscannerPage, {
      type: "takein",
      case: this.selectedCaseNo
    });
  }
  takeinsend() { 
    if (this.selectedSamplingListsCount == 0) {
      alert('請先掃描新增攜入型號');
      return false;
    }
    let confirm = this.alertCtrl.create({
      title: '注意',
      message: '確定攜入?',
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
  };
  sendSamplingActivity() {
    let getNowDate = new Date().toISOString().slice(0, 10);
    this.restProvider.getSamplingActivityList(this.selectedCaseNo, "take_in")
      .then((activityListResult) => {
        for (let i = 0; i < sLen; i++) {
          let getSampling = this.selectedSamplingLists[i];
          let sendCheck = true;
          for (var actList in activityListResult) {
            //console.log(activityListResult[actList]['saquipment_no'] + "--" + activityListResult[actList]['action_date']);
            if (activityListResult[actList]['saquipment_no'] == getSampling && activityListResult[actList]['action_date'] == getNowDate) {
              sendCheck = false;
              break;
            }
          }
          if (sendCheck) { 
            this.restProvider.sendSamplingActivity(this.selectedCaseNo, getSampling, "take_in")
              .then((sendResult) => {
                return this.databaseprovider.deleteTakeInListRow(this.userAccount, this.selectedCaseNo, getSampling);
              })
              .then((deleteResult) => {
                if (deleteResult == 1) {
                  console.log(deleteResult);
                  console.log(getSampling + " ok!");
                } else {
                  this.presentToast("error: 1085");
                  throw new Error('break this chain');
                }
              })
              .catch(function (error) {
                console.log(getSampling + " 攜入失敗!");
                console.log(error);
              });
          } else {
            this.databaseprovider.deleteTakeInListRow(this.userAccount, this.selectedCaseNo, getSampling)
              .then((deleteResult) => {
                if (deleteResult == 1) {
                  console.log(deleteResult);
                  console.log(getSampling + " 重複攜入");
                } else {
                  this.presentToast("error: 1085");
                  throw new Error('break this chain');
                }
              })
              .catch(function (error) {
                console.log(getSampling + " 攜入失敗!");
                console.log(error);
              });
          }
        }
      })
      .catch(function (error) {
        console.log("get sampling activity list error ");
        console.log(error);
      });
    let sLen = this.selectedSamplingLists.length;

   
    alert('攜入成功 將轉跳案件清單');
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

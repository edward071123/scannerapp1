import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
// import { DbProvider } from "../../providers/db/db";
import { RestProvider } from "../../providers/rest/rest";
import { DatabaseProvider } from './../../providers/database/database';
/**
 * Generated class for the QrscannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qrscanner',
  templateUrl: 'qrscanner.html',
})
export class QrscannerPage {
  getType: any;
  selectedCaseNo: any;
  userAccount: any;
  samplingLists: any = [];
  modelLists: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public qrScanner: QRScanner,
    public databaseprovider: DatabaseProvider,
    public restProvider: RestProvider,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController) {
    this.getType = navParams.get('type');
    this.userAccount = localStorage.getItem("account");
    this.selectedCaseNo = navParams.get('case');
    console.log(this.getType + "-" + this.userAccount + "-" + this.selectedCaseNo);
    this.restProvider.getServerSamplingList()
      .then((result) => {
        this.samplingLists = result[0];
        this.modelLists = result[1];
        this.qrscanner();
      })
      .catch(function (error) {
        this.presentToast("發生錯誤 重整畫面中");
        this.viewCtrl._didEnter();
        console.log(error);
      });
  }
  qrscanner() { 
    console.log(this.userAccount);
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          console.log('authorized');
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            // stop scanning
            scanSub.unsubscribe();

            if (this.samplingLists.indexOf(text) > -1) {
              if (this.getType == "takeout") { 
                //check if exist in db
                this.databaseprovider.checkTakeInOutRepeat(this.userAccount, this.selectedCaseNo, text, this.getType)
                  .then(result => {
                    if (result == 1) {
                      this.presentToast(text + "已在清單");
                      throw new Error('break this chain');
                    } else if (result == 0) {
                      return this.databaseprovider.addSamplingTakeOutDb(this.userAccount, this.selectedCaseNo, text, this.getType, this.modelLists[this.samplingLists.indexOf(text)]);
                    } else {
                      this.presentToast("error: 1081");
                      throw new Error('break this chain');
                    }
                  })
                  .then((result) => {
                    if (result == 1)
                      this.presentToast(text + "儲存成功");
                    else {
                      this.presentToast("error: 1082");
                      throw new Error('break this chain');
                    }
                  })
                  .catch(function (error) {
                    //alert("發生錯誤");
                    console.log(error);
                  });
              } else {
                this.restProvider.getSamplingActivityList(this.selectedCaseNo, "taken_out")
                  .then((activityListResult) => {
                    let sendCheck = false;
                    for (var actList in activityListResult) {
                      if (activityListResult[actList]['saquipment_no'] == text) {
                        sendCheck = true;
                        break;
                      }
                    }
                    if (sendCheck) {
                      return this.databaseprovider.checkTakeInOutRepeat(this.userAccount, this.selectedCaseNo, text, this.getType);
                    } else {
                      this.presentToast(text + "未在攜出清單內");
                      throw new Error('break this chain');
                    }
                  })
                  .then((checkResult) => {
                    if (checkResult == 1) {
                      this.presentToast(text + "已在清單");
                      throw new Error('break this chain');
                    } else if (checkResult == 0) {
                      return this.databaseprovider.addSamplingTakeInDb(this.userAccount, this.selectedCaseNo, text, this.getType);
                    } else {
                      this.presentToast("error: 1081");
                      throw new Error('break this chain');
                    }
                  })
                  .then((addResult) => {
                    if (addResult == 1)
                      this.presentToast(text + "儲存成功");
                    else {
                      this.presentToast("error: 1082");
                      throw new Error('break this chain');
                    }
                  })
                  .catch(function (error) {
                    //alert("發生錯誤");
                    console.log(error);
                  });
              }
            } else {
              this.presentToast(text + "無此設備");
            }
            setTimeout(() => this.qrscanner(), 700);
          });
          
          // show camera preview
          window.document.querySelector('ion-app').classList.add('transparent-body');
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          console.log('denied');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          console.log('else');
        }
      })
      .catch((e: any) => {
        alert('Error is' + e);
      });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  ionViewWillUnload() {
    this.qrScanner.destroy();
    this.viewCtrl.dismiss();
  }
  public dismiss(): void {
    this.qrScanner.destroy();
    this.viewCtrl.dismiss();
  }
}

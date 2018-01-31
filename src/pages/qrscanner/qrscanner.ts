import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { DbProvider } from "../../providers/db/db";
import { RestProvider } from "../../providers/rest/rest";
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
  constructor(public navCtrl: NavController,
                      public navParams: NavParams,
                      public qrScanner: QRScanner,
                      public dbProvider: DbProvider,
                      public restProvider: RestProvider,
                      public viewCtrl: ViewController,
                      private toastCtrl: ToastController) {
    this.getType = navParams.get('type');
    this.userAccount = localStorage.getItem("account");
    this.selectedCaseNo = navParams.get('case');
    this.restProvider.getServerSamplingList()
      .then((result) => {
        this.samplingLists = result;
        this.qrscanner(this.userAccount, this.selectedCaseNo, this.getType, this.samplingLists);
      })
      .catch(function (error) {
        this.presentToast("發生錯誤 重整畫面中");
        this.viewCtrl._didEnter();
        console.log(error);
      });
  }

  qrscanner(accoount,caseNo, type, list) {
    
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          //alert('authorized');
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log(list);
            if (list.indexOf(text) > -1) {
              if (type == "takeout") {
                //check if exist in db
                this.dbProvider.checkTakeInOutRepeat(accoount, caseNo, text, type)
                  .then((result) => {
                    if (result != 0) {
                      this.presentToast(text + "已在清單");
                      throw new Error('break this chain');
                    } else {
                      return this.dbProvider.addSamplingTakeInOutDb(accoount, caseNo, text, type);
                    }
                  })
                  .then((result) => {
                    this.presentToast(result);
                  })
                  .catch(function (error) {
                    //alert("發生錯誤");
                    console.log(error);
                  });
              } else {
                this.restProvider.getSamplingActivityList(caseNo, "take_in")
                  .then((activityListResult) => {
                    let sendCheck = false;
                    for (var actList in activityListResult) {
                      if (activityListResult[actList]['saquipment_no'] == text) {
                        sendCheck = true;
                        break;
                      }
                    }
                    if (sendCheck) {
                      return this.dbProvider.checkTakeInOutRepeat(accoount, caseNo, text, type);
                    } else {
                      this.presentToast(text + "未在攜出清單內");
                      throw new Error('break this chain');
                    }
                  })
                  .then((checkResult) => {
                    if (checkResult != 0) {
                      this.presentToast(text + "已在清單");
                      throw new Error('break this chain');
                    } else {
                      return this.dbProvider.addSamplingTakeInOutDb(accoount, caseNo, text, type);
                    }
                  })
                  .then((addResult) => {
                    this.presentToast(addResult);
                  })
                  .catch(function (error) {
                    //alert("發生錯誤");
                    console.log(error);
                  });
              }
            } else {
              this.presentToast(text+"無此設備");
            }
            scanSub.unsubscribe(); // stop scanning
            this.qrscanner(accoount, caseNo, type, list);

          });

          //this.qrScanner.resumePreview();

          // show camera preview
          window.document.querySelector('ion-app').classList.add('transparent-body');
          this.qrScanner.show()
            .then((data: QRScannerStatus) => {
              //alert(data.showing);
            }, err => {
              alert(err);
            });
          
          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          alert('denied');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          alert('else');
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
  public dismiss(): void {
    this.viewCtrl.dismiss();
  }
}

import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  apiUrl = 'http://52.90.92.75/api/v1/';
  loginUrl = 'login';
  samplingCaseListUrl = 'sampling/case?order=latest_first';
  getServerSamplingListUrl = 'saquipment';
  sendSamplingActivityUrl = 'saquipment_use?log_method=phone&';
  getSamplingActivityListUrl = 'saquipment_use?';
  constructor(public http: Http) {
    console.log('Hello RestProvider Provider');
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      console.log(credentials);
      this.http.post(this.apiUrl + this.loginUrl, credentials, { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          console.log("login api erro :", err);
          reject(err);
        });
    });
  }
  allSamplingCaseList(userId) {
    return new Promise((resolve, reject) => {
      let sendUrl = this.samplingCaseListUrl + "&examiner_user_id=" + userId;
      //let sendUrl = this.samplingCaseListUrl;
      console.log(sendUrl);
      let headers = new Headers();
      let userToken = 'Bearer ' + localStorage.getItem("token");
      headers.append('Authorization', userToken);
      this.http.get(this.apiUrl + sendUrl, { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          console.log("get sampling case api erro :", err);
          reject(err);
        });
    });
  }
  getServerSamplingList() {
    return new Promise((resolve, reject) => {
      let sendUrl = this.apiUrl + this.getServerSamplingListUrl;
      let headers = new Headers();
      let userToken = 'Bearer ' + localStorage.getItem("token");
      headers.append('Authorization', userToken);
      this.http.get(sendUrl, { headers: headers }).
        subscribe(res => {
          let getSamplingLists = res.json();
          let SamplingLists = [];
          let modelLists = [];
          let all = [];
          for (var i = 0; i < getSamplingLists.length; i++) {
            SamplingLists.push(getSamplingLists[i].no);
            modelLists.push(getSamplingLists[i].name);
          }
          all.push(SamplingLists);
          all.push(modelLists);
          resolve(all);
        }, (err) => {
          console.log("get sampling activity list api erro :", err);
          reject(err);
        });
    });
  }
  sendSamplingActivity(samplingCaseNo, saquipmentNo, action) {
    return new Promise((resolve, reject) => {
      let sendUrl = this.apiUrl + this.sendSamplingActivityUrl;
      sendUrl += "saquipment_no=" + saquipmentNo + "&sampling_case_no=" + samplingCaseNo + "&action=" + action + "&log_method=phone";
      let headers = new Headers();
      let userToken = 'Bearer ' + localStorage.getItem("token");
      headers.append('Authorization', userToken);
      this.http.post(sendUrl, {} ,{ headers: headers }).
        subscribe(res => {
          resolve(res);
        }, (err) => {
          console.log("send sampling activity api erro :", err);
          resolve(err);
        });
    });
  }

  getSamplingActivityList(samplingCaseNo, action) {
    return new Promise((resolve, reject) => {
      let sendUrl = this.apiUrl + this.getSamplingActivityListUrl;
      sendUrl += "sampling_case_no=" + samplingCaseNo + "&filter=" + action;
      let headers = new Headers();
      let userToken = 'Bearer ' + localStorage.getItem("token");
      headers.append('Authorization', userToken);
      this.http.get(sendUrl, { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          console.log("get sampling activity list api erro :", err);
          reject(err);
        });
    });
  }
}

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
          reject(err);
        });
    });
  }
  allSamplingCaseList() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      let userToken = 'Bearer ' + localStorage.getItem("token");
      headers.append('Authorization', userToken);
      this.http.get(this.apiUrl + this.samplingCaseListUrl, { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }
  addUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/users', JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      // this.http.post(this.apiUrl + '/users', JSON.stringify(data), {
      //   headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
      //   params: new HttpParams().set('id', '3'),
      // }).subscribe(res => {
      //   resolve(res);
      // }, (err) => {
      //   reject(err);
      // });
    });
  }
}

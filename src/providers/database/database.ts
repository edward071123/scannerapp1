import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  constructor(
    public sqlitePorter: SQLitePorter,
    private storage: Storage,
    private sqlite: SQLite,
    private platform: Platform) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'scanner.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }

  fillDatabase() {
    let sql = 'CREATE TABLE IF NOT EXISTS takein(rowid INTEGER PRIMARY KEY, account TEXT, caseno TEXT, samplingno TEXT, modelno TEXT);';
    sql += 'CREATE TABLE IF NOT EXISTS takeout(rowid INTEGER PRIMARY KEY, account TEXT, caseno TEXT, samplingno TEXT, modelno TEXT);';
    this.sqlitePorter.importSqlToDb(this.database, sql)
      .then(data => {
        this.databaseReady.next(true);
        this.storage.set('database_filled', true);
      })
      .catch(e => console.error(e));
  }

  checkTakeInOutRepeat(account, caseNo, sampling, type) { 
    let data = [account, caseNo, sampling];
    let sqlStatement = 'SELECT * FROM takeout WHERE account = ? AND caseno = ? AND samplingno = ?';
    if (type == "takein")
      sqlStatement = 'SELECT * FROM takein WHERE account = ? AND caseno = ? AND samplingno = ?' 
    return this.database.executeSql(sqlStatement, data).then((res) => {
      let getLenth = parseInt(res.rows.length);
      if (getLenth == 0)
        return 0;
      else
        return 1;
    }, err => {
      console.log(err);
      return -1;
    });
  }
  addSamplingTakeInDb(account, caseNo, sampling, type) {
    let data = [account, caseNo, sampling];
    let sqlStatement = 'INSERT INTO takein (rowid,account,caseno,samplingno)  VALUES(NULL,?,?,?)';
    return this.database.executeSql(sqlStatement, data).then(res => {
      console.log(res);
      return 1;
    }, err => {
      console.log(err);
      return 0;
    });
  }
  addSamplingTakeOutDb(account, caseNo, sampling, type, model) {
    let data = [account, caseNo, sampling, model];
    let sqlStatement = 'INSERT INTO takeout (rowid,account,caseno,samplingno,modelno)  VALUES(NULL,?,?,?,?)';
    return this.database.executeSql(sqlStatement, data).then(res => {
      console.log(res);
      return 1;
    }, err => {
      console.log(err);
      return 0;
    });
  }
  getTakeOutList(account, caseNo) {
    let data = [account, caseNo];
    let sqlStatement = 'SELECT * FROM takeout WHERE account = ? AND caseno = ?';
    return this.database.executeSql(sqlStatement, data).then((res) => {
      let samplingsList = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          samplingsList.push({
            rowid: res.rows.item(i).rowid,
            samplingno: res.rows.item(i).samplingno,
            modelno: res.rows.item(i).modelno
          });
        }
      }
      return samplingsList;
    }, err => {
      console.log(err);
      return [];
    });
  }
  deleteTakeOutListRow(rowId) {
    let data = [rowId];
    let sqlStatement = 'DELETE FROM takeout WHERE rowid = ?';
    return this.database.executeSql(sqlStatement, data).then(res => {
      console.log(res);
      return 1;
    }, err => {
      console.log(err);
      return 0;
    });
  }
  deleteTakeInListRow(account, caseNo, sampling) {
    let data = [account, caseNo, sampling];
    let sqlStatement = 'DELETE FROM takein WHERE account = ? AND caseno = ? AND samplingno = ?';
    return this.database.executeSql(sqlStatement, data).then(res => {
      console.log(res);
      return 1;
    }, err => {
      console.log(err);
      return 0;
    });
  }
  getTakeInList(account, caseNo) {
    let data = [account, caseNo];
    let sqlStatement = 'SELECT * FROM takein WHERE account = ? AND caseno = ?';
    return this.database.executeSql(sqlStatement, data).then((res) => {
      let samplingsList = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          samplingsList.push(res.rows.item(i).samplingno);
        }
      }
      return samplingsList;
    }, err => {
      console.log(err);
      return [];
    });
  }
  deleteAccountTakeInList(account) {
    let data = [account];
    let sqlStatement = 'DELETE FROM takein WHERE account = ?';
    return this.database.executeSql(sqlStatement, data).then(res => {
      console.log(res);
      return 1;
    }, err => {
      console.log(err);
      return 0;
    });
  }
  deleteAccountTakeOutList(account) {
    let data = [account];
    let sqlStatement = 'DELETE FROM takeout WHERE account = ?';
    return this.database.executeSql(sqlStatement, data).then(res => {
      console.log(res);
      return 1;
    }, err => {
      console.log(err);
      return 0;
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }
}

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';


/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {
  myAppDatabase: SQLiteObject;

  constructor(public sqlite: SQLite) {
    console.log('Hello DbProvider Provider');
    this.initDatabase();
  }
  
  initDatabase() {
    this.sqlite.create({
      name: 'scanner.db',
      location: 'default'
    }).then((database: SQLiteObject) => {
      database.executeSql('CREATE TABLE IF NOT EXISTS takeout(rowid INTEGER PRIMARY KEY, account TEXT, caseno TEXT, samplingno TEXT)', {})
        .then(res => console.log('takeout Executed SQL'))
        .catch(e => console.log(e));
      database.executeSql('CREATE TABLE IF NOT EXISTS takein(rowid INTEGER  PRIMARY KEY, account TEXT, caseno TEXT, samplingno TEXT)', {})
        .then(res => console.log('takein Executed SQL'))
        .catch(e => console.log(e));
      this.myAppDatabase = database;
    })
  }
  checkTakeInOutRepeat(account, caseno, sampling, type) {;
    return new Promise((resolve, reject) => {
      let sqlStatement = 'SELECT * FROM takeout WHERE account = ? AND caseno = ? AND samplingno = ?'
      if (type == "takein")
        sqlStatement = 'SELECT * FROM takein WHERE account = ? AND caseno = ? AND samplingno = ?' 
      this.myAppDatabase.executeSql(sqlStatement, [account, caseno, sampling])
        .then(res => {
          let getLenth = parseInt(res.rows.length);
          resolve(getLenth);
        })
        .catch(e => {
          console.log("check take sql erro :", e);
          reject("check take sql error");
        });
    });
  }
  addSamplingTakeInOutDb(account, caseno, sampling, type) {
    return new Promise((resolve, reject) => {
      let sqlStatement = 'INSERT INTO takeout VALUES(NULL,?,?,?)'
      if (type == "takein")
        sqlStatement = 'INSERT INTO takein VALUES(NULL,?,?,?)'
      this.myAppDatabase.executeSql(sqlStatement, [account, caseno, sampling])
        .then(res => {
          console.log('insert take list success ');
          resolve(sampling + "儲存清單");
        })
        .catch(e => {
          console.log("insert take  sql error :",e);
          reject("insert take  sql error");
        });
    });
  }
  getTakeOutList(account, caseno) {
    return new Promise((resolve, reject)  => {
      this.myAppDatabase.executeSql('SELECT * FROM takeout WHERE account = ? AND caseno = ?', [account, caseno])
        .then(res => {
          let takeOutLists = [];
          for (var i = 0; i < res.rows.length; i++) {
            takeOutLists.push({ id: res.rows.item(i).rowid, samplingno: res.rows.item(i).samplingno });
          }
          resolve(takeOutLists);
        })
        .catch(e => {
          console.log("get take out list error: ", e);
          reject("get take out list error");
        });
    });
  }
  deleteTakeOutListRow(rowId) { 
    return new Promise((resolve, reject) => {
      this.myAppDatabase.executeSql('DELETE FROM takeout WHERE rowid = ?', [rowId])
        .then(res => {
          resolve('攜出單項刪除成功');
        })
        .catch(e => {
          console.log("delete take out list row error: ", e);
          reject("delete take out list row error");
        });
    });
  }
  deleteTakeInListRow(account, caseNo, sampling) {
    return new Promise((resolve, reject) => {
      this.myAppDatabase.executeSql('DELETE FROM takein WHERE account = ? AND caseno = ? AND samplingno = ?', [account, caseNo, sampling])
        .then(res => {
          resolve(sampling+'攜入清單刪除成功');
        })
        .catch(e => {
          console.log("delete take in list row error: ", e);
          reject("delete take in list row error");
        });
    });
  }
  getTakeInList(account, caseNo) {
    return new Promise((resolve, reject) => {
      this.myAppDatabase.executeSql('SELECT * FROM takein WHERE account = ? AND caseno = ?', [account, caseNo])
        .then(res => {
          let takeInLists = [];
          for (var i = 0; i < res.rows.length; i++) {
            takeInLists.push(res.rows.item(i).samplingno);
          }
          resolve(takeInLists);
        })
        .catch(e => {
          console.log("get take in list error: ", e);
          reject("get take in list error");
        });
    });
  }
}

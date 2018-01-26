import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {
  options: any = {
    name: 'scanner.db',
    location: 'default'
  }

  constructor(public http: HttpClient, private sqlite: SQLite) {
    console.log('Hello DbProvider Provider');

    this.sqlite.create(this.options).then((db: SQLiteObject) => {
      //Prva tablica
      db.executeSql('CREATE TABLE IF NOT EXISTS users (account VARCHAR(255),token VARCHAR(255))', {})
        .then(() => console.log('Executed SQL - users'))
        .catch(e => console.log(e));
    })
      .catch(e => console.log(e));
  }
  public saveUserToSqlite(DataArray) {
    this.sqlite.create(this.options)
      .then((db: SQLiteObject) => {
        db.executeSql("INSERT INTO users (account, token) VALUES (?,?,?)", [DataArray.name, DataArray.user_name, DataArray.location]).then((data) => {
          console.log("INSERTED: " + JSON.stringify(data));
        }, (error) => {
          console.log("ERROR kod inserta: " + JSON.stringify(error.err));
        });
      })
      .catch(e => console.log(e));
  }
  public getUserToken() {
    return new Promise((resolve, reject) => {
      this.sqlite.create(this.options)
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM users ", []).then((data) => {
            let DataArray = [];
            if (data.rows.length > 0) {
              for (let i = 0; i < data.rows.length; i++) {
                DataArray.push({
                  name: data.rows.item(i).name,
                  user_name: data.rows.item(i).user_name,
                  location: data.rows.item(i).location
                });
              }
            }
            resolve(DataArray);
          }, (error) => {
            reject(error);
          });
        })
        .catch(e => console.log(e));
    });
  }
}

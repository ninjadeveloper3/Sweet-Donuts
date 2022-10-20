import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalStringsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalStringsProvider {
  // login screen
  public static forgot_password: String  = "Forgot Password?";
  public static signup: String  = "to create a new account";

  public myGlobalVar: string;
  constructor(public http: HttpClient) {
    console.log('Hello GlobalStringsProvider Provider');
  }

}

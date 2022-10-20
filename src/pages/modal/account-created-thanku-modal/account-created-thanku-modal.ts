import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../login/login';

/**
 * Generated class for the AccountCreatedThankuModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-created-thanku-modal',
  templateUrl: 'account-created-thanku-modal.html',
})
export class AccountCreatedThankuModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountCreatedThankuModalPage');
  }
  gotoLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

}

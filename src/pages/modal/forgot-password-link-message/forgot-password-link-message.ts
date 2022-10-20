import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ForgotPasswordLinkMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password-link-message',
  templateUrl: 'forgot-password-link-message.html',
})
export class ForgotPasswordLinkMessagePage {
  loginType: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loginType = this.navParams.get('loginType');
    console.log("login type ", this.loginType);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordLinkMessagePage');
  }
  dismiss() {
    this.navCtrl.pop();
  }

}

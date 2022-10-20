import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ReOrderConfirmModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-re-order-confirm-modal',
  templateUrl: 're-order-confirm-modal.html',
})
export class ReOrderConfirmModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReOrderConfirmModalPage');
  }
  callback(selection) {
    let data = selection;
    this.viewCtrl.dismiss(data);
  }

}

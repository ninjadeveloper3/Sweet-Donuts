import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StoreTimingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-store-timings',
  templateUrl: 'store-timings.html',
})
export class StoreTimingsPage {
  Timings: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.Timings = this.navParams.get('timings');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreTimingsPage');
  }
  pop() {
    this.navCtrl.pop();
  }

}

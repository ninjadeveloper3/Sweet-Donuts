import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { OrderHistoryPage } from '../order-history/order-history';
import { RateUsPage } from '../modal/rate-us/rate-us';
import { HomePage } from '../home/home';

/**
 * Generated class for the OrderThankyouPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-thankyou',
  templateUrl: 'order-thankyou.html',
})
export class OrderThankyouPage {
  order_id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    debugger
    this.order_id = this.navParams.get('orderId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderThankyouPage');
  }
  orderHistory() {
    this.navCtrl.setRoot(OrderHistoryPage);
  }
  rateUs() {
    this.navCtrl.setRoot(RateUsPage, { 'orderID': this.order_id });
  }
  gotoHome() {
    this.navCtrl.setRoot(HomePage);
  }
}

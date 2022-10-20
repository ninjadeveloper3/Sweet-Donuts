import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyCartPage } from '../../my-cart/my-cart';
import { AllCategoriesPage } from '../../all-categories/all-categories';

/**
 * Generated class for the AddToCartModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-to-cart-modal',
  templateUrl: 'add-to-cart-modal.html',
})
export class AddToCartModalPage {
  prod_qty: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    debugger
    this.prod_qty = this.navParams.get('quantity');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddToCartModalPage');
  }
  addMore() {
    // this.navCtrl.pop();
    this.navCtrl.setRoot(AllCategoriesPage);
  }
  checkout() {
    this.navCtrl.setRoot(MyCartPage);
  }
}

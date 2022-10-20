import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { MyCartPage } from '../my-cart/my-cart';
import { MainProvider } from '../../providers/main/main';
import { ServicesProvider } from '../../providers/services/services';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';
import { StoreInfoPage } from '../modal/store-info/store-info';
import { ReOrderConfirmModalPage } from '../re-order-confirm-modal/re-order-confirm-modal';

/**
 * Generated class for the ReOrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-re-order-details',
  templateUrl: 're-order-details.html',
})
export class ReOrderDetailsPage {
  order_type: string;
  tax: any;
  cart_items: any;
  totalPrice: any = 0;
  subTotal: any = 0;
  gstAmount: number = 0;
  promo: any;
  promo_applied: boolean = false;
  discount: number = 0;
  reOrderItems: any = [];
  order: any;
  items: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public mainProvider: MainProvider, public modalCtrl: ModalController,
    public rest: ServicesProvider, public ionicComponent: ionicComponents, public alertCtrl: AlertController) {
    this.items = this.navParams.get('reorder');
    debugger

    console.log("re-order modal", this.items);
  }
  ionViewWillEnter() {
    let gst = this.mainProvider.getItems('StoreObj');
    let option_price = 0;

    console.log("items ", this.items)
    console.log("gst", gst);
    console.log("reorder details", this.order);
    console.log('ionViewDidLoad OrderReviewPage');
    debugger
    for (let i = 0; i < this.items.orderInfo.length; i++) {

      if (this.items.orderInfo[i].doptions.length > 0) {
        for (let j = 0; j < this.items.orderInfo[i].doptions.length; j++) {
          this.items.orderInfo[i].base_price += this.items.orderInfo[i].doptions[j].Price;
        }
      }
      this.subTotal += this.items.orderInfo[i].base_price * this.items.orderInfo[i].qty;
    }

    let total_holder = 0;
    this.gstAmount = this.mainProvider.taxToAmount(gst.OrderSettings.Tax, this.subTotal);
    total_holder = this.subTotal + this.gstAmount;
    this.totalPrice = total_holder - this.discount;
    this.totalPrice = this.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  ItemInfo(item) {
    debugger
    let Modal = this.modalCtrl.create(StoreInfoPage, { 'ItemInfo': item });
    Modal.present();
  }
  ReOrderNow() {


    let profileModal = this.modalCtrl.create(ReOrderConfirmModalPage);
    profileModal.onDidDismiss(data => {
      console.log(data);
      if (data == 'confirm') {
        let cart = [];
        cart = this.mainProvider.getItems('localCartData');
        if (cart == null || cart.length == 0) {
          cart = [];
        }
        for (var i = 0; i < this.items.orderInfo.length; i++) {
          cart.push(this.items.orderInfo[i]);
        }
        this.mainProvider.storeItems('localCartData', cart);
        this.navCtrl.setRoot(MyCartPage);
      }
    });
    profileModal.present();
  }
  pop() {
    this.navCtrl.pop();
  }

}

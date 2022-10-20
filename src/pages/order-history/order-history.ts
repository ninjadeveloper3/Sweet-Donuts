import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ReOrderDetailsPage } from '../re-order-details/re-order-details';
import { AddAddressPage } from '../modal/add-address/add-address';
import { FoodFeedbackPage } from '../modal/food-feedback/food-feedback';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';
import { ServicesProvider } from '../../providers/services/services';
import { MainProvider } from '../../providers/main/main';

/**
 * Generated class for the OrderHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {
  order_history: {}[];
  showError: boolean = false;
  emptyMessage: string = 'Please login first to view all orders!';
  from_notification: any;
  pre_value: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public ionicComponent: ionicComponents,
    public rest: ServicesProvider, public main: MainProvider) {
  }
  ionViewWillEnter() {
    let userId = this.main.getItems('userObject');
    this.pre_value = false;
    this.main.storeItems('pageName', 'OrderHistory');
    if (userId == null) {
      this.showError = true;
      this.emptyMessage = 'Please login first to view all orders!';
      return false;
    }
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.doGetOrderHistory(userId.ID)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.order_history = data.ResponseResult.Orders;
            this.ionicComponent.hideLoader();
            this.pre_value = this.main.getSessionStorage('notification');
            if (this.pre_value) {
              // this.navCtrl.push(FoodFeedbackPage);
            }
          }
          else {
            this.ionicComponent.hideLoader();
            this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
          }
        });
    }
    else {
      this.ionicComponent.ShowToast("No Internet Connection!");
    }
  }
  ionViewDidLoad() {
  }
  feedback() {
    this.navCtrl.push(FoodFeedbackPage);
  }
  get_status(item) {
    switch (item.Status) {
      case 'DELIVERED':
        return "DELIVERED";
      case "READY":
        return "READY";
      case "CANCELLED":
        return "CANCELLED";
      case "PENDING":
        return "PENDING";
      case "CONFIRMED":
        return "CONFIRMED";
      case "DISPATCHED":
        return "DISPATCHED";
      case "REJECTED":
        return "REJECTED";
      case "ON THE WAY":
        return "ONTHEWAY";
    }

  }
  ReOrderDetailsPage(reorder) {
    this.navCtrl.push(ReOrderDetailsPage, { 'reorder': reorder });
  }
  ionViewWillLeave() {
    this.main.StoreSessionStorage('notificationOpened', null);
    this.main.removeStorage('pageName');
  }

}

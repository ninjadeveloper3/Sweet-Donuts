import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderHistoryPage } from '../../order-history/order-history';
import { HomePage } from '../../home/home';
import { ionicComponents } from '../../../providers/ionic-components/ionic-components';
import { ServicesProvider } from '../../../providers/services/services';
import { MainProvider } from '../../../providers/main/main';

/**
 * Generated class for the RateUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rate-us',
  templateUrl: 'rate-us.html',
})
export class RateUsPage {
  rating: Number = 0;
  orderID: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public ionicComponent: ionicComponents, public rest: ServicesProvider, public main: MainProvider) {
    this.orderID = this.navParams.get('orderID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RateUsPage');
  }
  starClicked(value) {
    console.log("Rated :", value);
  }
  rate(val) {
    this.rating = val;

    console.log("rating ", val)
  }
  orderHistory() {
    debugger
    let data = {
      OrderID: this.orderID,
      Rating: this.rating
    }
    if (this.rating == 0) {
      this.ionicComponent.ShowToast("Please rate first!");
      return false;
    }
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.orderRating(data)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.ionicComponent.hideLoader();
            this.navCtrl.setRoot(OrderHistoryPage);
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


}

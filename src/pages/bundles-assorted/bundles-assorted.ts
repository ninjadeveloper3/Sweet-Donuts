import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ComboDetailsPage } from '../combo-details/combo-details';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';
import { ServicesProvider } from '../../providers/services/services';
import { MyCartPage } from '../my-cart/my-cart';
import { MainProvider } from '../../providers/main/main';

/**
 * Generated class for the BundlesAssortedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bundles-assorted',
  templateUrl: 'bundles-assorted.html',
})
export class BundlesAssortedPage {
  assorted_deals: any;
  imgPathServer: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: ServicesProvider, public ionicComponent: ionicComponents, public main: MainProvider) {
    this.assorted_deals = this.navParams.get('combo_selection');
    this.imgPathServer = this.rest.imagesURL;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BundlesAssortedPage');
  }
  setocart() {
    this.navCtrl.setRoot(MyCartPage)
  }
  gotoComboDetails(deal) {
    console.log("store : ", this.main.getItems('StoreObj'))
    let storeId = this.main.getItems('StoreObj').ID
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.combodetailproductid(deal.Id, storeId)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            this.ionicComponent.hideLoader();
            this.navCtrl.push(ComboDetailsPage, { 'combo': data.ResponseResult.DealDetail });
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
  pop() {
    this.navCtrl.pop();
  }
}

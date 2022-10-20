import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MainProvider} from '../../providers/main/main';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {ServicesProvider} from '../../providers/services/services';
import {ProductDetailsPage} from '../product-details/product-details';
import {MyCartPage} from '../my-cart/my-cart';

/**
 * Generated class for the MyFavouritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-favourites',
  templateUrl: 'my-favourites.html',
})
export class MyFavouritesPage {
  heart: string;
  products: { id: string; name: string; is_fav: boolean; favImage: string; }[];
  emptyMessage: string = '';
  show: boolean = false;
  local_storage_user: any;
  imagePathUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public main: MainProvider, public ionicComponent: ionicComponents, public rest: ServicesProvider) {
    this.imagePathUrl = this.rest.imagesURL;
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad MyFavouritesPage');
    this.dogetAllFav();
  }

  dogetAllFav() {
    this.local_storage_user = this.main.getItems('userObject');
    console.log("local storage user ", this.local_storage_user);
    let data;
    if (this.local_storage_user == null) {
      this.emptyMessage = 'Please login first to view all favourites items!';
      this.show = true;
      // this.ionicComponent.ShowToast("Please login first to perform this action!");
      return false;
    }
    this.dogetAllFavAPI(this.local_storage_user);
  }

  dogetAllFavAPI(user) {
    let store = this.main.getItems('StoreObj');
    let data = {
      CustomerID: user.ID,
      SellerID: this.rest.sellerId,
      StoreID: store.ID
    }
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.GetFavouriteProducts(data)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.ionicComponent.hideLoader();
            this.products = data.ResponseResult.FavouriteProducts;
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

  toggleLiked(card: any) {
    debugger
    if (card.is_fav === true) {
      this.removeFromFav(card);
    } else {

    }
  }

  removeFromFav(prod) {
    let storeId = this.main.getItems('StoreObj');
    let data = {
      CustomerId: this.local_storage_user.ID,
      ProductId: prod.ID,
      SellerId: this.rest.sellerId,
      StoreId: storeId.ID
    }
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader(); //CustomerId, ProductId, SellerId, StoreId
      this.rest.RemoveFavourite(data)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.ionicComponent.hideLoader();
            let index = this.products.indexOf(prod);
            this.products.splice(index, 1);
            this.ionicComponent.ShowToast("Item removed from your favourites!");
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

  gotoProduct(prod) {
    debugger
    let store_id = this.main.getItems('StoreObj').ID;
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader(); //CustomerId, ProductId, SellerId, StoreId
      this.rest.getProductDetails(prod.ID, store_id)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.ionicComponent.hideLoader();
            this.navCtrl.push(ProductDetailsPage, {'product': data.ResponseResult.Product});
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

  setocart() {
    this.navCtrl.setRoot(MyCartPage)
  }
}

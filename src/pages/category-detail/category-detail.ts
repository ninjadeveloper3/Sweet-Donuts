import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, ShowWhen } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';
import { AddToCartModalPage } from '../modal/add-to-cart-modal/add-to-cart-modal';
import { ServicesProvider } from '../../providers/services/services';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';
import { MainProvider } from '../../providers/main/main';
import { MyCartPage } from '../my-cart/my-cart';

/**
 * Generated class for the CategoryDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-detail',
  templateUrl: 'category-detail.html',
})
export class CategoryDetailPage {
  heart: string;
  products: { id: string; name: string; is_fav: boolean; }[];
  catagory: any;
  imgPathServer: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public rest: ServicesProvider, public ionicComponent: ionicComponents, public main: MainProvider) {
    debugger
    this.catagory = this.navParams.get('cat_selection');
    this.imgPathServer = this.rest.imagesURL;
    console.log("selected catagory", this.catagory);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryDetailPage');
  }
  toggleLiked(card: any) {
    let local_storage_user = this.main.getItems('userObject');
    console.log("local storage user ", local_storage_user);
    let data;
    if (local_storage_user == null) {
      this.ionicComponent.ShowToast("Please login first to perform this action!");
      return false;
    }
    else {
      let storeId = this.main.getItems('StoreObj');
      data = {
        CustomerId: local_storage_user.ID,
        ProductId: card.ID,
        SellerId: this.rest.sellerId,
        StoreId: storeId.ID
      }
      if (card.is_fav === true) {
        this.removeFromFav(data, card);
      } else {
        this.addToFav(data, card);
      }
    }

  }
  addToFav(data, card) {
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader(); //CustomerId, ProductId, SellerId, StoreId
      this.rest.AddToFavourites(data)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.ionicComponent.hideLoader();
            card.is_fav = true;
            this.heart = 'heart';
            this.ionicComponent.ShowToast("Item added to your favourites!");
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
  removeFromFav(data, card) {
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader(); //CustomerId, ProductId, SellerId, StoreId
      this.rest.RemoveFavourite(data)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.ionicComponent.hideLoader();
            this.heart = 'heart-outline';
            card.is_fav = false;
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
  gotoProdDetails(prod) {
    this.navCtrl.push(ProductDetailsPage, { 'product': prod });
  }
  pop() {
    this.navCtrl.pop();
  }
  setocart() {
    this.navCtrl.setRoot(MyCartPage)
  }
  addtoCart() {
    this.navCtrl.push(AddToCartModalPage)
  }
  encodeURL(base,uri)
  {
    let url = base+uri;
    return encodeURI(url);
  }
}

import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { CategoryDetailPage } from '../category-detail/category-detail';
import { BundlesAssortedPage } from '../bundles-assorted/bundles-assorted';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';
import { ServicesProvider } from '../../providers/services/services';
import { MainProvider } from '../../providers/main/main';
import { ComboDetailsPage } from '../combo-details/combo-details';
import { MyCartPage } from '../my-cart/my-cart';
import { ImageLoader } from 'ionic-image-loader';


/**
 * Generated class for the AllCategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-categories',
  templateUrl: 'all-categories.html',
})
export class AllCategoriesPage {
  favourites: ({ id: number; title: string; description: string; icon: string; imageUrl: string; products?: undefined; } | { id: number; title: string; description: string; icon: string; imageUrl: string; products: { id: string; name: string; image: string; is_fav: boolean; }[]; })[];
  Combos: any;
  AllCatagories: any;
  imgPathServer: string;
  ComboTitle: any;
  ComboImg: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController,
    public ionicComponent: ionicComponents, public rest: ServicesProvider, public main: MainProvider, private imageLoader: ImageLoader) {
    this.imgPathServer = this.rest.imagesURL;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllCategoriesPage');
  }
  ionViewWillEnter() {
    console.log('ionViewDidLoad MyAddressesPage');
    this.deGetAllCatagories();
  }
  gotoCatDetails(value) {
    let user = this.main.getItems('userObject');
    let store = this.main.getItems('StoreObj');
    let userId;
    if (user == null) {
      userId = 'null'
    }
    else {
      userId = user.ID;
    }
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.Catagoriesproductid(store.ID, value.ID, userId)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.ionicComponent.hideLoader();
            this.navCtrl.push(CategoryDetailPage, { 'cat_selection': data.ResponseResult.CategoryDetail });
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
  gotoComboDetailsPage(value) {
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      let storeId = this.main.getItems('StoreObj');
      this.rest.comboproductid(value.Id, storeId.ID)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log("hamza", data);
            this.ionicComponent.hideLoader();
            this.navCtrl.push(BundlesAssortedPage, { 'combo_selection': data.ResponseResult.DealsDetail });
          }
          else {
            this.ionicComponent.hideLoader();
            this.ionicComponent.ShowToast('Coming soon!');
            this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
          }
        });
    }
    else {
      this.ionicComponent.ShowToast("No Internet Connection!");
    }
  }
  deGetAllCatagories() {
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      let store = this.main.getItems('StoreObj');
      this.rest.CategoriesBySellerAndStoreID(store.ID)
        .subscribe(data => {
          console.log("response", data);
          this.ionicComponent.hideLoader();
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.Combos = data.ResponseResult.AllBundles;
            this.ComboTitle = this.Combos.BundleName;
            this.ComboImg = this.Combos.BundleImageUsr;
            this.AllCatagories = data.ResponseResult.AllCategories;
          }
          else {
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
  onImageLoad(event) {
    console.log("Image is Ready!");
    // do something with the loader
  }
  encodeURL(base, uri) {
    let url = base + uri;
    return encodeURI(url);
  }
}

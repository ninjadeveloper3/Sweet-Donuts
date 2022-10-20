import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import {CheckoutPage} from '../checkout/checkout';
import {AllCategoriesPage} from '../all-categories/all-categories';
import {MainProvider} from '../../providers/main/main';
import {ServicesProvider} from '../../providers/services/services';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {LoginPage} from '../login/login';
import {StoreInfoPage} from '../modal/store-info/store-info';


/**
 * Generated class for the MyCartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-cart',
  templateUrl: 'my-cart.html',
})
export class MyCartPage {

  total_price: number = 0;
  total_quantity: number = 0;
  temp_price: number = 0;
  calculatedTax: any;
  PromoAdded: boolean = false;
  taxPercentage: number = 0;
  cart_items: any;
  show: boolean = false;
  ImageBaseURL: string;
  StoreObj: any;
  promoCodeValue: any;
  instructions: string = '';
  emptyMessage: string;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public main: MainProvider, public mainProvider: MainProvider, public rest: ServicesProvider, public ionicComponent: ionicComponents, public alertCtrl: AlertController) {

    console.log("cart data ", this.mainProvider.getItems('localCartData'));
    this.ImageBaseURL = this.rest.imagesURL;
    this.cart_items = this.mainProvider.getItems('localCartData');
    this.StoreObj = this.mainProvider.getItems('TaxModal');
    this.taxPercentage = this.StoreObj.Tax;
    if (this.cart_items == null || this.cart_items.length < 1) {
      this.cart_items = [];
      this.emptyMessage = "You don't have any item in your cart!";
      this.show = true;
      this.mainProvider.storeItems("localCartData", this.cart_items);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyCartPage');
    console.log("cart length = ", this.cart_items);
    this.total_quantity = 0;
    this.total_price = 0;
    this.calculatedTax = 0;
    if (this.cart_items.length > 0) {
      let local_promo = this.main.getItems('PromoCode');
      for (var i = 0; i < this.cart_items.length; i++) {
        this.total_quantity += this.cart_items[i].qty;
        this.total_price += this.cart_items[i].base_price * this.cart_items[i].qty;
        this.calculatedTax = this.mainProvider.calculateTax(this.taxPercentage, this.total_price) + this.total_price;
      }
      if (local_promo !== null) {
        this.PromoAdded = true;
        console.log("local promo value", local_promo);
        console.log("code value", local_promo.Code);

        this.promoCodeValue = local_promo.Code;
        this.applyCode();
      }
    }
    else {
      this.show = true;
      this.promoCodeValue = "";
      this.main.removeStorage('PromoCode');
      this.PromoAdded = false;

    }
  }

  incrementQty(i) {
    console.log(i);
    i.qty++;
    this.total_quantity++;
    i.TotalPrice = i.qty * i.base_price;
    this.total_price += i.base_price;
    this.calculatedTax = this.mainProvider.calculateTax(this.taxPercentage, this.total_price) + this.total_price;
    this.mainProvider.storeItems("localCartData", this.cart_items);
    this.ionViewDidLoad();
  }

  decrementQty(i) {
    if (i.qty - 1 < 1) {
      console.log("its getting -1")
      i.qty = 1;
      this.confirmDelete(i);
    } else {
      i.qty--;
      this.total_quantity--;
      i.TotalPrice = i.qty * i.base_price;
      this.total_price -= i.base_price;
      this.calculatedTax = this.mainProvider.calculateTax(this.taxPercentage, this.total_price) + this.total_price;
      this.mainProvider.storeItems("localCartData", this.cart_items);
      this.ionViewDidLoad();
    }
  }

  confirmDelete(item) {
    let confirmAlert = this.alertCtrl.create({
      title: "Delete",
      message: "Are you sure you want to delete the item?",
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.removeItem(item);
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            return;

          }
        }
      ]
    });
    confirmAlert.present();
  }

  removeItem(item) {
    let index = this.cart_items.indexOf(item);
    if (index > -1) {
      this.cart_items.splice(index, 1);
      this.mainProvider.local_data.splice(index, 1);
      this.mainProvider.storeItems("localCartData", this.cart_items);
      debugger
      this.ionViewDidLoad();
    }
  }

  gotoCheckoutPage() {
    console.log("cart items", this.cart_items);
    let local_storage_user = this.mainProvider.getItems('userObject');
    let local_storage_store = this.main.getItems('StoreObj');
    if (this.cart_items == null || this.cart_items.length < 1) {
      this.ionicComponent.ShowToast('Your Shopping Cart is empty!');
      return false;
    }
    else if (local_storage_user == null) {
      this.ionicComponent.ShowToast("Please login first to checkout!");
      this.navCtrl.setRoot(LoginPage);
      return false;
    }
    else if (local_storage_store == null || local_storage_store == undefined) {
      this.ionicComponent.ShowToast('Please select location first!');
      return false;
    }
    else if (this.calculatedTax < local_storage_store.MinOrderValue) {
      this.ionicComponent.ShowToast('Minimum order should be ' + local_storage_store.MinOrderValue)
      return false;
    }

    else {
      this.navCtrl.push(CheckoutPage, {'instructions': this.instructions});
    }


  }

  gotoCategoriesPage() {
    this.navCtrl.push(AllCategoriesPage);
  }

  isAfter(fromDate, toDate) {
    var fromTokens = fromDate.split(":");
    var toTokens = toDate.split(":");
    return (fromTokens[0] < toTokens[0] || (fromTokens[0] == toTokens[0] && fromTokens[1] < toTokens[1]));
  }

  applyCode() {
    debugger
    let storeId = this.main.getItems('StoreObj');
    let local_storage_user = this.main.getItems('userObject');
    if (this.promoCodeValue == "" || this.promoCodeValue == undefined) {
      this.ionicComponent.ShowToast("No promo code added!");
      return false;
    }
    if (this.cart_items == null || this.cart_items.length < 1) {
      this.ionicComponent.ShowToast('You do not have any item in your cart to apply code!');
      return false;
    }
    if (local_storage_user == null) {
      this.ionicComponent.ShowToast("Please login first to add promo code!");
      return false;
    }
    else {
      this.checkPromoCodeApi(local_storage_user, storeId);
    }
  }

  checkPromoCodeApi(user, storeId) {
    let data = {
      CustomerID: user.ID,
      PromoCode: this.promoCodeValue,
      StoreID: storeId.ID
    }
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.PromoCode(data)
        .subscribe(data => {
          console.log("checkPromoCodeApi Response>> ", data);
          if (data.ResponseHeader.ResponseCode === 1) {
            this.ionicComponent.hideLoader();


            this.applyDiscountOnTotal(data.ResponseResult.PromoCode);
          }
          else {
            this.ionicComponent.hideLoader();
            this.main.removeStorage('PromoCode');
            this.PromoAdded = false;
            this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
          }
        });
    }
    else {
      this.ionicComponent.ShowToast("No Internet Connection!");
    }
  }

  applyDiscountOnTotal(discountModal) {
    if (this.calculatedTax < discountModal.MinimumAmount) {
      this.ionicComponent.ShowToast("Discount valid for minimum " + discountModal.MinimumAmount + " Amount");
      this.main.removeStorage('PromoCode');
      this.PromoAdded = false;
    }
    else {
      debugger
      this.main.storeItems('PromoCode', discountModal);
      // discountModal.DiscountType = 2;
      // discountModal.Discount = 200;
      if (discountModal.DiscountType == 1) { // Discount in percentage 
        this.calculatedTax = this.calculatedTax - this.mainProvider.calculateTax(discountModal.Discount, this.total_price);
        this.PromoAdded = true;
      }
      else { //Discount in ammount
        this.calculatedTax = this.calculatedTax - discountModal.Discount;//this.mainProvider.taxToAmount(discountModal.Discount, this.calculatedTax);
        this.PromoAdded = true;
      }
    }
  }

  removeapplyCode() {
    // this.ionicComponent.ShowToast("promo removed");
    this.main.removeStorage('PromoCode');
    this.PromoAdded = false;
    this.ionViewDidLoad();

  }

  addMoreItems() {
    this.navCtrl.setRoot(AllCategoriesPage);
  }

  ItemInfo(item) {
    // this.navCtrl.push(StoreInfoModalPage, { 'ItemInfo':item });
    let Modal = this.modalCtrl.create(StoreInfoPage, {'ItemInfo': item});
    Modal.present();
  }
}

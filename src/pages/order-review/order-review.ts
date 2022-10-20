import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {AllCategoriesPage} from '../all-categories/all-categories';
import {OrderThankyouPage} from '../order-thankyou/order-thankyou';
import {MainProvider} from '../../providers/main/main';
import {StoreInfoPage} from '../modal/store-info/store-info';
import {ServicesProvider} from '../../providers/services/services';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser';

/**
 * Generated class for the OrderReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-review',
  templateUrl: 'order-review.html',
})
export class OrderReviewPage {
  // inAppBrowser configurations
  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no' 
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls 
    hardwareback: 'no',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only 
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only 
    toolbar: 'no', //iOS only 
    enableViewportScale: 'no', //iOS only 
    allowInlineMediaPlayback: 'no',//iOS only 
    presentationstyle: 'pagesheet',//iOS only 
    fullscreen: 'yes',//Windows only    
  };
  // ------------------------------------------------
  order_type: string;
  tax: any;
  items: any[];
  selectedaddres: any;
  cart_items: any;
  totalPrice: any = 0;
  subTotal: any = 0;
  gstAmount: number = 0;
  promo: any;
  promo_applied: boolean = false;
  discount: number = 0;
  promoCode: number = 0;
  order_id: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mainProvider: MainProvider, public modalCtrl: ModalController,
              public rest: ServicesProvider, public ionicComponent: ionicComponents, private iab: InAppBrowser, public main: MainProvider) {
    // selected address
    this.selectedaddres = this.navParams.get('selectedaddress');
    console.log("selected adress", this.selectedaddres);
  }

  ionViewWillEnter() {
    debugger
    this.items = this.mainProvider.getItems('localCartData');
    let gst = this.mainProvider.getItems('StoreObj');
    this.promo = this.mainProvider.getItems('PromoCode');
    console.log("gst", gst);
    console.log("cart item", this.items);
    console.log('ionViewDidLoad OrderReviewPage');
    for (let i = 0; i < this.items.length; i++) {
      this.subTotal += this.items[i].base_price * this.items[i].qty;
    }
    let total_holder = 0;
    this.gstAmount = this.mainProvider.taxToAmount(gst.OrderSettings.Tax, this.subTotal);
    total_holder = this.subTotal + this.gstAmount;
    if (this.promo !== null) {
      // debugger
      this.promo_applied = true;
      if (this.promo.DiscountType == 1) { //discount in percentage
        this.discount = this.mainProvider.taxToAmount(this.promo.Discount, this.subTotal);
        console.log("discount ammount = ", this.discount);
      }
      else { //discount in ammount
        this.discount = this.promo.Discount;//this.mainProvider.calculateTax(this.promo.Discount, total_holder);
        console.log("discount ammount = ", this.discount);
      }
    }

    this.totalPrice = total_holder - this.discount;
    this.totalPrice = this.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ionViewDidLoad() {
  }

  addmoreItems() {
    this.navCtrl.setRoot(AllCategoriesPage);
  }

  OrderNow() {
    console.log("order array = ", JSON.stringify(this.items));
    let promo = this.mainProvider.getItems('PromoCode');
    if (promo !== null) {
      this.promoCode = promo.ID;
    }
    var postData = {
      ID: this.order_id,
      SellerID: this.rest.sellerId,
      StoreID: this.mainProvider.getItems('StoreObj').ID,
      CustomerID: this.mainProvider.getItems('userObject').ID,
      AddressID: this.selectedaddres.AddressId.ID,
      PromoCodeID: this.promoCode,
      OrderType: 1,
      paymentType: this.selectedaddres.paymentId,
      Amount: this.totalPrice,
      orderInfo: this.items,
      Instructions: this.selectedaddres.order_instruct
    };
    console.log("post data ", JSON.stringify(postData));
    this.placeOrderApi(postData);
  }

  placeOrderApi(order) {
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.doPlaceOrder(order)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            debugger
            console.log(data);
            this.ionicComponent.hideLoader();
            this.order_id = data.OrderID;
            if (order.paymentType == 1) { //launch browser
              this.payWithMCB(data.QuerystringUrl);
            }
            else {
              this.mainProvider.removeStorage('localCartData');
              this.mainProvider.removeStorage('PromoCode');
              this.navCtrl.setRoot(OrderThankyouPage, {'orderId': data.OrderID});
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

  pop() {
    this.navCtrl.getPrevious().data.newGame = true;
    this.navCtrl.pop();
  }

  payWithMCB(url) {
    let target = "_blank";
    let browser = this.iab.create(url, target, this.options);
    let PaymentLocalUrl = 'www.Sweetdonuts.pk';
    let PaymenStagingUrl = 'staging.Sweetdonuts.pk/payment/3Party_Receipt';

    let __this = this;
    browser.on('loadstop').subscribe((data) => {
      //Do whatever here
      console.log("browser url", data.url);
      var string = data.url;
      var substring = PaymentLocalUrl;
      var substring2 = PaymenStagingUrl;
      console.log("substring : ", substring);
      console.log("sub string 2 : ", PaymentLocalUrl)
      console.log("condition : ", string.includes(substring));
      if (string.includes(substring) || string.includes(substring2)) {
        console.log("your local call back loaded!");
        let data = {
          vpc_TxnResponseCode: __this.getQueryVariable("vpc_TxnResponseCode", string),
          vpc_BatchNo: __this.getQueryVariable("vpc_BatchNo", string),
          vpc_ReceiptNo: __this.getQueryVariable("vpc_ReceiptNo", string),
          vpc_VerStatus: __this.getQueryVariable("vpc_VerStatus", string),
          vpc_VerToken: __this.getQueryVariable("vpc_VerToken", string)
        }
        console.log("your required object : ", data);
        if (data.vpc_TxnResponseCode == '0') {
          browser.close();
          this.mainProvider.removeStorage('localCartData');
          this.mainProvider.removeStorage('PromoCode');
          this.navCtrl.setRoot(OrderThankyouPage, {'orderId': this.order_id});
        }
        else {
          browser.close();
        }

      }
      browser.executeScript({code: "document.getElementsByTagName('html')[0].innerHTML"}).then(function (values) {
        console.log("values : ", values);
      })
    }, err =>
      console.error(err));
  }

  ItemInfo(item) {
    let Modal = this.modalCtrl.create(StoreInfoPage, {'ItemInfo': item});
    Modal.present();
  }

  getQueryVariable(param, string) {
    var query = string;
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == param) {
        return pair[1];
      }
    }
    return (false);
  }
}

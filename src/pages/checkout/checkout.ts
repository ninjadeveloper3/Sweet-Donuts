import {Component} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  ToastController,
  ViewController
} from 'ionic-angular';
import {OrderReviewPage} from '../order-review/order-review';
import {AddAdressPage} from '../add-adress/add-adress';
import {MainProvider} from '../../providers/main/main';
import {ServicesProvider} from '../../providers/services/services';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';

declare var google;

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  fname: string = 'First Name';
  lname: string = 'Last Name';
  email: string = 'Email';
  address: string = 'Address';
  phone: string = 'Phone';
  selectedAddress: any;
  test_users_data: any;
  emptyMessage: any;
  addresses: any;
  show: boolean;
  selectedadress: any;
  payment: number;
  SelectionValid: boolean = true;
  newGame: any;
  promo_code_added: boolean = false;
  instruct: any;
  isEnabled: boolean = true;
  selectedAddressFlag: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ionicComponent: ionicComponents, public main: MainProvider,
              public rest: ServicesProvider, public modalCtrl: ModalController, public alertCtrl: AlertController, private toastCtrl: ToastController, public viewCtrl: ViewController) {
    this.instruct = this.navParams.get('instructions');
  }

  ionViewWillEnter() {
    let promo_code = this.main.getItems('PromoCode');
    if (promo_code == null) {
      this.promo_code_added = false;
    }
    else {
      this.promo_code_added = true;
    }
    console.log("promo ", promo_code);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');

    // Getting user adresses
    let userId = this.main.getItems('userObject');
    this.newGame = this.navParams.get('newGame') || null;
    console.log("newGame", this.newGame);
    if (userId) {
      if (this.main.isConnected()) {
        this.rest.AllAddressByUserId(userId.ID)
          .subscribe(data => {
            if (data.ResponseHeader.ResponseCode === 1) {
              debugger
              this.test_users_data = data.ResponseResult.ShippingAddress;
              if (this.test_users_data.length > 0) {
                this.isEnabled = false;
              }
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
    else {
      this.ionicComponent.ShowToast('Please login first to view all addresses!');
    }
  }

  addAddress() {
    let profileModal = this.modalCtrl.create(AddAdressPage);
    profileModal.onDidDismiss(data => {
      this.ionViewDidLoad();
    });
    profileModal.present();
  }

  OrderType() {
  }

  gotoOrderReview() {
    debugger
    if (!this.selectedAddressFlag) {
      this.ionicComponent.ShowToast('Oops we couldn’t find your location, please find another delivery point!');
    }
    else {
      if (this.selectedadress == null || this.selectedadress == 0 || this.payment == 0 || this.payment == undefined || this.SelectionValid == false) {
        this.ionicComponent.ShowToast("Sorry! You need to select required options");
      } else {
        let checkoutObj = {
          AddressId: this.selectedadress,
          paymentId: this.payment,
          order_instruct: this.instruct
        }
        this.navCtrl.push(OrderReviewPage, {'selectedaddress': checkoutObj});
      }
    }
  }

  change(selectedValue: any) {
    this.selectedadress = selectedValue;
    console.log("selected", this.selectedadress);
    debugger
    if (this.selectedadress == 0 || this.selectedadress == "0") {
    }
    else {
      var geocoder = new google.maps.Geocoder();
      this.geocodeAddress(geocoder);
    }
  }

  PaymentSelect(val) {
  }

  pop() {
    this.navCtrl.pop();
  }

  geocodeAddress(geoCoder) {
    debugger
    var address = this.selectedadress.Street;
    let Main = this.main;
    let local_this = this;
    let ionicComponent = this.ionicComponent;
    this.ionicComponent.ShowLoader();
    geoCoder.geocode({'address': address}, function (results, status) {
      if (status === 'OK') {
        console.log("results : ", results);
        console.log("lat ", results[0].geometry.location.lat());
        console.log("lng ", results[0].geometry.location.lng());
        local_this.getStoreWithAddress(results[0].geometry.location.lat(), results[0].geometry.location.lng());
      } else {
        ionicComponent.hideLoader();
        ionicComponent.ShowToast('Oops we couldn’t find your location, please find another delivery point!');
        local_this.selectedadress = null;
        local_this.selectedAddressFlag = false;
      }
    });
  }

  getStoreWithAddress(lat, long) {
    if (this.main.isConnected()) {
      this.rest.doGetStoresByLocation(lat, long)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            if (data.ResponseResult.Store !== null) {
              console.log("exist");
              this.ionicComponent.hideLoader();
              this.doCheckSameStore(data.ResponseResult.Store);
              this.SelectionValid = true;
            }
            else {
              this.SelectionValid = false;
              this.ionicComponent.hideLoader();
              this.selectedadress == null
              this.ionicComponent.ShowToast("Selected Address is not in our delivery range");
              this.selectedadress = null;
              this.selectedAddressFlag = false;
              this.ionViewDidLoad();
            }
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

  doCheckSameStore(Store) {
    debugger
    let local_store = this.main.getItems('StoreObj');
    console.log("local store", local_store);
    if (local_store.ID == Store.ID) {
      console.log("you can to ahead");
      this.selectedAddressFlag = true;
    }
    else {
      this.SelectionValid = false;
      this.ionicComponent.ShowToast('Selected Address is not in our delivery range');
      this.selectedadress = null;
      this.selectedAddressFlag = false;
      this.ionViewDidLoad();
    }
  }

  selectClick() {
    console.log("click trigger");

  }
}

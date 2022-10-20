import {Component, Injectable, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, PopoverController, Events, Content} from 'ionic-angular';
import {AddRemovePopoverPage} from '../add-remove-popover/add-remove-popover';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {AddAdressPage} from '../add-adress/add-adress';
import {ServicesProvider} from '../../providers/services/services';
import {MainProvider} from '../../providers/main/main';


/**
 * Generated class for the MyAddressesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Injectable()
@Component({
  selector: 'page-my-addresses',
  templateUrl: 'my-addresses.html',
})
export class MyAddressesPage {
  @ViewChild(Content) content: Content;
  addresses: any;
  scrollstatus: any;
  emptyMessage: string;
  show: boolean = false;
  userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public popoverCtrl: PopoverController,
              public ionicComponent: ionicComponents, public rest: ServicesProvider, public main: MainProvider, public events: Events) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad MyAddressesPage');
    this.deGetAllAddresses();
  }

  ionViewDidLoad() {
  }

  addnewAddress() {
    let user = this.main.getItems('userObject');
    if (user == null) {
      this.emptyMessage = 'Please login first to view all addresses!';
    }
    else {
      this.navCtrl.push(AddAdressPage);
    }

  }

  presentPopover(item) {
    let popover = this.popoverCtrl.create(AddRemovePopoverPage, {'selectedAddress': this.addresses});
    popover.present({
      ev: event
    });
    popover.onDidDismiss(data => {
      console.log(data);
      if (data !== null) {
        this.ionicComponent.ShowLoader();
        if (data == 'remove') {
          let alert = this.ionicComponent.ConfirmAlert('Remove', 'Are you sure you want to remove address?', 'Remove');
          alert.present();
          alert.onDidDismiss((data) => {
            if (data == true) {
              let index = this.addresses.indexOf(item);
              this.removeAddress(index);
              if (index > -1) {

              }
            }
            else {
              this.ionicComponent.hideLoader();
            }
          });

        }
        else {
          this.ionicComponent.hideLoader();
          this.navCtrl.push(AddAdressPage, {'EditAddress': item});
        }
      }
    });
  }

  // GET ALL ADDRESSES FUNCTION
  deGetAllAddresses() {
    this.ionicComponent.ShowLoader();
    this.userId = this.main.getItems('userObject');
    console.log("user obj", this.userId);
    if (this.userId) {
      if (this.main.isConnected()) {
        this.rest.AllAddressByUserId(this.userId.ID)
          .subscribe(data => {
            console.log("response", data);
            this.ionicComponent.hideLoader();
            if (data.ResponseHeader.ResponseCode === 1) {
              console.log(data);
              this.addresses = data.ResponseResult.ShippingAddress;
              this.show = false;

            }

            else {
              this.emptyMessage = data.ResponseHeader.ResponseMessage;
              this.show = true;
              // this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
            }

          });
      }
      else {
        this.ionicComponent.ShowToast("No Internet Connection!");
      }
    }
    else {
      this.ionicComponent.hideLoader();
      this.emptyMessage = 'Please login first to view all addresses!';
      this.show = true;
      // this.ionicComponent.ShowToast('Please login first to view all addresses!');
    }

  }

  removeAddress(index) {
    let userId = this.main.getItems('userObject');
    let body = {"CustomerID": userId.ID, "ShippAddID": this.addresses[index].ID}
    if (this.main.isConnected()) {
      this.rest.deleteAddressByCustomerId(body)
        .subscribe(data => {
          console.log("response", data);
          this.ionicComponent.hideLoader();
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.addresses.splice(index, 1);
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

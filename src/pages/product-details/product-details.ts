import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MyCartPage} from '../my-cart/my-cart';
import {AddToCartModalPage} from '../modal/add-to-cart-modal/add-to-cart-modal';
import {ServicesProvider} from '../../providers/services/services';
import {MainProvider} from '../../providers/main/main';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';

/**
 * Generated class for the ProductDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  information: any;
  heart: string;
  sec: boolean = false;
  selected_prod: any;
  currentNumber: number = 1;
  imgPathServer: any;
  modal: any;
  optionValue: any;
  CartData: any;
  selection_array = [];
  prodlegth = [];
  req_array: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: ServicesProvider, public main: MainProvider, public ionicComponent: ionicComponents) {
    this.selected_prod = this.navParams.get('product');
    console.log("selected product = ", this.selected_prod)
    this.imgPathServer = this.rest.imagesURL;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
    // for (let i = 0; i < this.selected_prod.Products.length; i++) {
    this.req_array = [];
    for (let j = 0; j < this.selected_prod.ProductOption.length; j++) {
      if (this.selected_prod.ProductOption[j].IsRequired == true) {

        this.req_array.push(this.selected_prod.ProductOption[j]);
      }
    }
    // } 
    console.log("req array", this.req_array);
  }

  toggleLiked(card: any) {
    if (this.selected_prod.is_fav === true) {
      this.heart = 'heart-outline';
      this.selected_prod.is_fav = false;
    } else {
      this.selected_prod.is_fav = true;
      this.heart = 'heart';
    }
  }

  pop() {
    this.navCtrl.pop();
  }

  toggleSection(i) {

    for (let j = 0; j < this.selected_prod.ProductOption.length; j++) {
      if ((this.selected_prod.ProductOption[i] != this.selected_prod.ProductOption[j]) && this.selected_prod.ProductOption[j].open) {
        this.selected_prod.ProductOption[j].open = !this.selected_prod.ProductOption[j].open;
      }
    }
    this.selected_prod.ProductOption[i].open = !this.selected_prod.ProductOption[i].open;

  }

  func() {
    if (this.sec) {
      this.sec = false;
    }
    else {
      this.sec = true;
    }

  }

  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j].open;
  }

  increment() {
    this.currentNumber++;
  }

  decrement() {
    if (this.currentNumber <= 1) {

    }
    else {
      this.currentNumber--;
    }


  }

  gotoCart() {
    debugger
    let optionArray = [];
    let dataModal = {};
    this.prodlegth = this.selected_prod.ProductOption;
    let counter = 0;
    let requiredopt = 0;
    console.log("yes", counter);
    let price = 0;
    let bundleId = 0;
    if (this.selection_array.length !== 0 || this.selection_array.length !== null) {
      let req = false;
      for (let j = 0; j < this.req_array.length; j++) {
        for (let k = 0; k < this.selection_array.length; k++) {
          if (this.req_array[j].ID == this.selection_array[k].pID) {
            req = true;
            break;
          }
          else {
            req = false;
          }
        }
        if (!req) {
          // this.ionicComponent.ShowToast("Please select " + this.req_array[j].FullName + " option!");
          this.ionicComponent.ShowToast("Please select " + "'" + this.req_array[j].FullName + "'" + " option!");
          return false;
        }
      }

      for (var i = 0; i < this.selection_array.length; i++) {
        if (this.selection_array[i])
          price += this.selection_array[i].c_optionPrice;
        optionArray.push({
          OptionID: this.selection_array[i].pID,
          Values: this.selection_array[i].c_Id,
          OptionName: this.selection_array[i].c_FullName,
          Price: this.selection_array[i].c_optionPrice,
          pId: this.selection_array[i].pId
        })
      }
    }
    else {
    }

    let modal = this.main.AddToCartModal(this.selected_prod.FullName, this.selected_prod.Price + price, bundleId, null, optionArray, this.selected_prod.Image, this.selected_prod.ID, this.currentNumber, null)
    console.log(this.selection_array);
    this.main.addTocart(null, modal);
    this.navCtrl.push(AddToCartModalPage, {'quantity': modal});
  }

  radioClicked(parent, val) {
    debugger
    console.log("val = ", parent, val);
    if (this.selection_array.length !== 0) {
      for (var i = 0; i < this.selection_array.length; i++) {
        if (this.selection_array[i].pID == parent.ID) {
          this.selection_array.splice(i, 1);
        }

      }
      this.selection_array.push({
        pFullName: parent.FullName,
        pID: parent.ID,
        c_Id: val.ID,
        c_FullName: val.FullName,
        c_optionPrice: val.Price,
        pId: this.selected_prod.ID,
        IsReq: parent.IsRequired
      });

    }
    else {
      this.selection_array.push({
        pFullName: parent.FullName,
        pID: parent.ID,
        c_Id: val.ID,
        c_FullName: val.FullName,
        c_optionPrice: val.Price,
        IsReq: parent.IsRequired
      });
    }
  }

  setocart() {
    this.navCtrl.setRoot(MyCartPage)
  }

  encodeURL(base, uri) {
    let url = base + uri;
    return encodeURI(url);
  }
}

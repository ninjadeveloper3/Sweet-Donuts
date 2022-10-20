import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyCartPage } from '../my-cart/my-cart';
import { ServicesProvider } from '../../providers/services/services';
import { MainProvider } from '../../providers/main/main';
import { AddToCartModalPage } from '../modal/add-to-cart-modal/add-to-cart-modal';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';

/**
 * Generated class for the ComboDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-combo-details',
  templateUrl: 'combo-details.html',
})
export class ComboDetailsPage {

  currentNumber: number = 1;
  sec: boolean = false;
  deal: any;
  combo_items: any;
  imgPathServer: any;
  information: any;
  selection_array = [];
  prodlegth = [];
  prodoptionlength = [];
  prodoption: any;
  req_array :any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: ServicesProvider, public main: MainProvider, public ionicComponent: ionicComponents) {
    this.combo_items = this.navParams.get('combo');
    console.log("combos", this.combo_items);
    this.imgPathServer = this.rest.imagesURL;
    this.information = [{
      "name": "Select Variation",
    },
    ]

  }

  ionViewDidLoad() {debugger
    console.log('ionViewDidLoad ComboDetailsPage');
    this.req_array = [];
    for(let i = 0; i<this.combo_items.Products.length; i++){
      for(let j=0; j<this.combo_items.Products[i].ProductOption.length;j++){
        if(this.combo_items.Products[i].ProductOption[j].IsRequired == true){
          this.req_array.push(this.combo_items.Products[i]);
        } 
      }
    }console.log("req array", this.req_array);
     
  }
  pop() {
    this.navCtrl.pop();
  }
  toggleSection(i) {
  for(let j=0; j<this.combo_items.Products.length; j++){
    if((this.combo_items.Products[i] != this.combo_items.Products[j]) && this.combo_items.Products[j].open){
      this.combo_items.Products[j].open = !this.combo_items.Products[j].open;
    }
  }
  this.combo_items.Products[i].open = !this.combo_items.Products[i].open;
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
  setocart() {
    this.navCtrl.setRoot(MyCartPage)
  }
  gotoCart() {
    let optionArray = [];
    let dataModal = {};
    this.prodlegth = this.combo_items.Products;
    let price = 0;
    let counter = 0;
    let requiredopt = 0;
    let pId = 0;
    console.log("this.selection_array", this.selection_array);

    if (this.selection_array.length !== 0 || this.selection_array.length !== null) {
      let req = false;
      let counter = 0;
      for( let j = 0; j<this.req_array.length; j++){
        for(let k =0; k<this.selection_array.length; k++){
          if(this.req_array[j].ID == this.selection_array[k].prodId){ 
            req = true;
            break;
          }
          else{
            req = false;
          }
        }
        if(!req){
          this.ionicComponent.ShowToast("Please select "+"'"+ this.req_array[j].FullName +"'"+" option!");
          return false;
        }
      }


      for (var i = 0; i < this.selection_array.length; i++) {
        price += this.selection_array[i].c_optionPrice;
        optionArray.push({ OptionID: this.selection_array[i].ProductOptionID, Values: this.selection_array[i].c_Id, OptionName: this.selection_array[i].c_FullName, Price: this.selection_array[i].c_optionPrice, prodId: this.selection_array[i].prodId })
      }
    }
    else {
    } debugger
    let modal = this.main.AddToCartModal(this.combo_items.BundleName, this.combo_items.BundlePrice + price, this.combo_items.Id, null, optionArray, this.combo_items.BundleImageUsr, pId, this.currentNumber, this.combo_items.Detail)
    console.log(this.selection_array);
    this.main.addTocart(null, modal);
    this.navCtrl.push(AddToCartModalPage, { 'quantity': modal });

  }
  radioClicked(parent, val, prodoption) {
    console.log("val = ", parent, val, prodoption);
    if (this.selection_array.length !== 0) {
      for (var i = 0; i < this.selection_array.length; i++) {
        if (this.selection_array[i].prodId == parent.ID) {
          this.selection_array.splice(i, 1);
        }
      }
      this.selection_array.push({ pFullName: parent.FullName, ProductOptionID: val.ProductOptionID, c_Id: val.ID, c_FullName: val.FullName, c_optionPrice: val.Price, prodId: parent.ID, IsReq: prodoption.IsRequired });

    }
    else {
      this.selection_array.push({ pFullName: parent.FullName, ProductOptionID: val.ProductOptionID, c_Id: val.ID, c_FullName: val.FullName, c_optionPrice: val.Price, prodId: parent.ID, IsReq: prodoption.IsRequired });
    }
  }
}

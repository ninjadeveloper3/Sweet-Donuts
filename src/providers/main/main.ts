import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Network} from '@ionic-native/network';
import SimpleCrypto from "simple-crypto-js";

/*
  Generated class for the MainProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MainProvider {
  AppLogo: string = '../assets/Sweet_Donuts_images/Forgot-password/logo.png';
  local_data = [];
  _secretKey: any;
  simpleCrypto: any;

  constructor(public http: HttpClient, private _net: Network) {
    console.log('Hello MainProvider Provider');
    this._secretKey = 'SecurityString';
    this.simpleCrypto = new SimpleCrypto(this._secretKey);
  }

  // *************Tax Calculation**********************
  calculateTax(tax, totalAmount): number {
    return Math.round(tax / 100 * totalAmount);
  }

  taxToAmount(tax, totalAmount) {
    return Math.round(totalAmount * tax / 100);
  }

  // *****************function to work with local storage *****************//
  // *****************cart item store*************
  storeItems(itemsName, itemsArray) {
    debugger
    if (itemsArray !== null && itemsArray !== "null") {
      var encrypted = this.simpleCrypto.encrypt(itemsArray);
      console.log("Encryption process...");
      console.log("Plain Object     : " + itemsArray);
      console.log("Encrypted Object : " + encrypted);
      localStorage.setItem(itemsName, encrypted);
    }
    else {
      localStorage.setItem(itemsName, itemsArray);
    }


  }

  getItems(itemsName) {
    debugger
    var retrievedData = localStorage.getItem(itemsName);
    if (retrievedData == null || retrievedData == "null") {
      return null;
    }
    else {

      var decrypted = this.simpleCrypto.decrypt(retrievedData, true);
      console.log("... and then decryption...");
      console.log("Decrypted object : " + decrypted);
      console.log("... done.");
      var items = decrypted;
      console.log("items after parse : ", items);
      return items;
    }


  }

  removeStorage(key) {
    localStorage.removeItem(key);
  }

  //session storage
  StoreSessionStorage(itemsName, itemsArray) {
    sessionStorage.setItem(itemsName, JSON.stringify(itemsArray));
  }

  getSessionStorage(itemsName) {
    var retrievedData = sessionStorage.getItem(itemsName);
    if (retrievedData) {
      var items = JSON.parse(retrievedData);
      return items;
    }
    else {
      return null;
    }
  }

  // check if phone number or email
  checkInputType(email) {
    debugger
    console.log("this is email");
    var mail_pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    var phone_patteren = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
    console.log(mail_pattern.test(email));
    if (mail_pattern.test(email)) {
      return 'email';
    }
    if (phone_patteren.test(email)) {
      return 'phone';
    }
    else {
      return 'wrong'
    }
  }

  // Add to Cart 

  addTocart(reOrder, prodOptions) {
    debugger
    let cart_items = this.getItems('localCartData');
    let same_product = false;
    let same_option = false;
    let same_option_flag = 0;
    if (cart_items !== null) {
      for (var r = 0; r < cart_items.length; r++) {
        same_option_flag = 0;
        if (cart_items[r].pId == prodOptions.pId) {
          console.log("product exist in cart");
          if (prodOptions.doptions.length > 0) {
            for (let j = 0; j < cart_items[r].doptions.length; j++) {
              if (cart_items[r].doptions.length == prodOptions.doptions.length) {
                if (cart_items[r].doptions[j].OptionID == prodOptions.doptions[j].OptionID && cart_items[r].doptions[j].Values == prodOptions.doptions[j].Values) {
                  //exectly same product in cart
                  same_option_flag++;
                  // same_option = true;
                }
                else {
                  break;
                }

              }
            }
          }
          if ((same_option_flag > 0 && same_option_flag == prodOptions.doptions.length) || (prodOptions.doptions.length <= 0 && cart_items[r].bundleId == prodOptions.bundleId)) {
            cart_items[r].qty += prodOptions.qty;
            this.storeItems('localCartData', cart_items);
            return false;
          }
        }

      }
      // if (!same_product) {
      let local_cart_data = this.getItems('localCartData');
      local_cart_data.push(prodOptions)
      this.storeItems('localCartData', local_cart_data);
      // }
    }
    else {
      this.local_data.push(prodOptions);
      this.storeItems('localCartData', this.local_data);
    }

  }

  AddToCartModal(name, price, bundleId, description, options, image, pId, qty, detail) {
    let modal;
    if (bundleId == 0) { //its product
      return modal = {
        FullName: name,
        TotalPrice: price,
        base_price: price,
        bundleId: bundleId,
        description: description,
        doptions: options,
        imageURL: image,
        pId: pId,
        qty: qty
      }
    }
    else { //Combo
      return modal = {
        FullName: name,
        TotalPrice: price,
        base_price: price,
        bundleId: bundleId,
        description: description,
        doptions: options,
        imageURL: image,
        pId: pId,
        qty: qty,
        Detail: detail,
      }
    }
  }

  isConnected(): boolean {
    let conntype = this._net.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  static encodeURL(base, uri) {
    let url = base + uri;
    return encodeURI(url);
  }
}


//user object key  = 'userObject',
//Store Info key = 'StoreInfo',
// Store Object = 'StoreObj';
//Store location search selected key = 'StoreLocationObj';
// Cart data  = 'localCartData';
//Promo Code = 'PromoCode';
//Device ID = 'deviceID';
//Order Id  = 'orderID';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StoreInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-store-info',
  templateUrl: 'store-info.html',
})
export class StoreInfoPage {
  ItemInfo: any;
  value_matched: boolean = false;
  optionArray: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    debugger
    this.ItemInfo = this.navParams.get('ItemInfo');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreInfoPage');
    console.log("Hi there ", this.ItemInfo);
    this.optionArray = [];
    console.log("hamza", this.optionArray);
    let counter = 1;
    for (var i = 0; i < this.ItemInfo.doptions.length; i++) {
      if (this.optionArray[0] == null) {
        this.optionArray.push({ OptionID: this.ItemInfo.doptions[i].OptionID, OptionName: this.ItemInfo.doptions[i].OptionName, counter: counter });

      } else {
        debugger
        this.value_matched = false;
        for (var j = 0; j < this.optionArray.length; j++) {
          if (this.ItemInfo.doptions[i].OptionName == this.optionArray[j].OptionName) {
            this.optionArray[j].counter++;
            this.value_matched = true;
          }
        }
        if (!this.value_matched) {
          this.optionArray.push({ OptionID: this.ItemInfo.doptions[i].OptionID, OptionName: this.ItemInfo.doptions[i].OptionName, counter: counter });
        }
      }
    }
  }
  changeLocation() {
    this.navCtrl.pop();
  }

}

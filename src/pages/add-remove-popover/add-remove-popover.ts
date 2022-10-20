import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AddRemovePopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-remove-popover',
  templateUrl: 'add-remove-popover.html',
})
export class AddRemovePopoverPage {
  AllAddresses: any;
  selectedAddress: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
    this.AllAddresses = this.navParams.get('selectedAddress');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRemovePopoverPage');
  }
  close(action){
    this.viewCtrl.dismiss(action);
  }

}

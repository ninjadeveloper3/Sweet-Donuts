import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormGroup, FormControl, Validators} from '@angular/forms';

declare var require: any

// var validators = require('credit-card-validate');

/**
 * Generated class for the PaymentInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-info',
  templateUrl: 'payment-info.html',
})
export class PaymentInfoPage implements OnInit {
  userData = {"cardnumber": "", "cvc": ""};
  userForm: any;
  validatecardnumber: any;
  _cvcnumber: any;
  _cardnumber: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _cdRef: ChangeDetectorRef) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentInfoPage');
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      cardnumber: new FormControl('', [Validators.required]),
      cvc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
    });
  }

  checkcvc(val) {
    this._cvcnumber = val;
    console.log("cvc", this._cvcnumber);
  }

  varifycard(val) {
    debugger
    this._cardnumber = val;
  }

}

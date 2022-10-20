import {Component, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, Validators} from "@angular/forms";
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {Injectable} from '@angular/core';
import {ValidationService} from '../../providers/services/validation-service';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {AccountCreatedThankuModalPage} from '../modal/account-created-thanku-modal/account-created-thanku-modal';
import {ServicesProvider} from '../../providers/services/services';
import {MainProvider} from '../../providers/main/main';

/**
 * Generated class for the PhoneVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Injectable()
@IonicPage()
@Component({
  selector: 'page-phone-verification',
  templateUrl: 'phone-verification.html',
})
export class PhoneVerificationPage {
  @ViewChild('a') a;
  @ViewChild('b') b;
  @ViewChild('c') c;
  @ViewChild('d') d;
  @ViewChild('e') e;
  @ViewChild('f') f;
  verificationCodeForm: any;
  customer: any;
  timer: number = 0;
  maxTime: number = 10;
  hidevalue: boolean = false;
;

  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder, public ionicComponent: ionicComponents,
              public modalCtrl: ModalController, public rest: ServicesProvider, public main: MainProvider) {
    this.customer = this.navParams.get('customer');
    this.verificationCodeForm = builder.group({
      'val1': [''],
      'val2': [''],
      'val3': [''],
      'val4': [''],
      'val5': [''],
      'val6': ['']
    })

    this.startCounter();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhoneVerificationPage');
  }

  focusKey(val) {

  }

  moveFocus(val, currentElement, nextElement, event) {
    console.log("value entered", this.verificationCodeForm.controls.val1.value, currentElement);
    console.log("next Element : ", nextElement);
    console.log("event : ", event);
    switch (val) {
      case 'one':
        if (event.keyCode == 8) {

        }
        else {
          this.b.setFocus();
        }
        // this.focusKey(val);
        break;
      case 'two':
        if (event.keyCode == 8) {
          this.a.setFocus();
        }
        else {
          this.c.setFocus();
        }
        break;
      case 'three':
        if (event.keyCode == 8) {
          this.b.setFocus();
        }
        else {
          this.d.setFocus();
        }
        break;
      case 'four':
        if (event.keyCode == 8) {
          this.c.setFocus();
        }
        else {
          this.e.setFocus();
        }
        break;
      case 'five':
        if (event.keyCode == 8) {
          this.d.setFocus();
        }
        else {
          this.f.setFocus();
        }
        break;
      case 'six':
        if (event.keyCode == 8) {
          this.e.setFocus();
        }
        else {
          this.a.setFocus();
        }
        break;
    }
    let arr = [];
    let counter = 0;
    for (var key in this.verificationCodeForm.controls) {
      if (this.verificationCodeForm.controls.hasOwnProperty(key)) {
        if (this.verificationCodeForm.controls[key].value !== "") {
          counter++;
        }
        else {
          return false;
        }
      }
    }
    if (counter == 6) {
      let input = this.verificationCodeForm.controls.val1.value + this.verificationCodeForm.controls.val2.value + this.verificationCodeForm.controls.val3.value + this.verificationCodeForm.controls.val4.value + this.verificationCodeForm.controls.val5.value + this.verificationCodeForm.controls.val6.value;
      if (input == this.customer.CustomerInformation.ConfirmationCode) {
        this.verifyCode(input);
      }
      else {
        // this.ionicComponent.showAlert('Alert', 'Please enter a valid verification code!')
        alert('Please enter a valid verification code!');
      }
    }
    else {
      console.log("value incomplete");
    }

  }

  verifyCode(code) {
    let load = this.ionicComponent;
    let navCtrl = this.navCtrl;
    //data preparing
    console.log("customer data ", this.customer)
    let data = {"CustomerID": this.customer.CustomerInformation.CustomerID, "MobileSecretCode": code}
    if (this.main.isConnected()) {
      load.ShowLoader();
      this.rest.CodeVerification(data)
        .subscribe(data => {
          console.log("response", data);
          if (data.ResponseHeader.ResponseCode === 1) {
            debugger
            console.log(data)
            // this.storage.storeItems('SMSCode', data.ResponseResult.CustomerInformation.ConfirmationCode)
            // this.storage.storeItems('AccountID', data.ResponseResult.CustomerInformation.CustomerID);
            this.ionicComponent.hideLoader();
            // this.navCtrl.push(PhoneVerificationPage, { 'customer': data.Customer });
            this.main.storeItems('userObject', this.customer.CustomerInfo);
            navCtrl.setRoot(AccountCreatedThankuModalPage);
          }

          else {
            load.hideLoader();
            this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
          }

        });
    }
    else {
      this.ionicComponent.ShowToast("No Internet Connection!");
    }
  }

  startCounter() {
    setTimeout(x => {
      if (this.maxTime <= 0) {

      }
      this.maxTime -= 1;

      if (this.maxTime > 0) {
        this.hidevalue = false;
        this.startCounter();
      }

      else {
        this.hidevalue = true;
      }

    }, 1000);
  }

  resend() {
    this.maxTime = 10;
    this.startCounter();
    this.resendCode();
  }

  accountCreated() {

  }

  pop() {
    this.navCtrl.pop();
  }

  resendCode() {
    let load = this.ionicComponent;
    let navCtrl = this.navCtrl;
    //data preparing
    let data = {"CustomerID": this.customer.CustomerInformation.CustomerID}
    if (this.main.isConnected()) {
      load.ShowLoader();
      this.rest.ReSendCode(data)
        .subscribe(data => {
          console.log("response", data);
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data)
            this.ionicComponent.hideLoader();
            this.ionicComponent.ShowToast("Code Resent!")
          }
          else {
            load.hideLoader();
            this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
          }

        });
    }
    else {
      this.ionicComponent.ShowToast("No Internet Connection!");
    }

  }
}

import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalStringsProvider} from '../../providers/global-strings/global-strings';
import {ValidationService} from '../../providers/services/validation-service';
import {ForgotPasswordPage} from '../forgot-password/forgot-password';
import {SignupPage} from '../signup/signup';
import {HomePage} from '../home/home';
import {MainProvider} from '../../providers/main/main';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {ServicesProvider} from '../../providers/services/services';
import {Events} from 'ionic-angular';
import {PhoneVerificationPage} from '../phone-verification/phone-verification';

declare var intercom: any;


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  signup_string: String;
  forgot_password_string: String;
  userForm: any;
  getAppLogo: string;
  loginType: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder, public main: MainProvider,
              public ionicComponent: ionicComponents, public rest: ServicesProvider, public events: Events) {
    this.forgot_password_string = GlobalStringsProvider.forgot_password;
    this.signup_string = GlobalStringsProvider.signup;
    this.userForm = builder.group({
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8), ValidationService.passwordValidator])],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.getAppLogo = this.main.AppLogo;
  }

  onSubmit(value) {
    let isValid = this.isValueEntered();
    if (isValid) {
      let body;
      let deviceInfo = this.main.getItems('deviceID');
      if (deviceInfo == null) {
        deviceInfo = {
          deviceID: null
        }
      }
      if (this.loginType == 'email') {
        body = {
          "EmailAddress": this.userForm.controls.email.value,
          "Password": this.userForm.controls.password.value,
          DeviceID: deviceInfo.deviceID,
          DeviceType: deviceInfo.deviceType
        };
      }
      else if (this.loginType == 'phone') {
        body = {
          "CellNumber": this.userForm.controls.email.value,
          "Password": this.userForm.controls.password.value,
          DeviceID: deviceInfo.deviceID,
          DeviceType: deviceInfo.deviceType
        };
      }
      else {
        this.ionicComponent.ShowToast("Invalid email/phone or password!");
        return false;
      }
      console.log("device id on login = ", this.main.getItems('deviceID'));
      if (this.main.isConnected()) {
        // http request
        this.ionicComponent.ShowLoader();
        this.rest.login(body)
          .subscribe(data => {
            console.log("response", data);
            if (data.ResponseHeader.ResponseCode === 1) {
              this.ionicComponent.hideLoader();
              this.main.storeItems('userObject', data.Customer.CustomerInfo);
              intercom.registerIdentifiedUser({userId: data.Customer.CustomerInfo.ID});
              intercom.updateUser({
                email: data.Customer.CustomerInfo.EmailAddress,
                name: data.Customer.CustomerInfo.FirstName
              });
              this.events.publish('loggedinGuest');
              this.navCtrl.setRoot(HomePage);
            }
            else if (data.ResponseHeader.ResponseCode === 11) { //user not verified
              this.ionicComponent.hideLoader();
              this.navCtrl.push(PhoneVerificationPage, {'customer': data.Customer})
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
      // data Modal
    }
    else {
      this.ionicComponent.ShowToast("Please enter your email/phone and password!")
    }

  }

  gotoForgotPassPage() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  gotoSignUpPage() {
    this.navCtrl.push(SignupPage);
  }

  pop() {
    this.navCtrl.pop();
  }

  isValueEntered() {
    if (this.userForm.controls.email.value == "" || this.userForm.controls.password.value == "") {
      return false;
    }
    else {
      this.loginType = this.main.checkInputType(this.userForm.controls.email.value);
      return true;
    }
  }

  gotoHomePage() {
    this.events.publish('loggedinGuest');
    this.navCtrl.setRoot(HomePage);
  }


}

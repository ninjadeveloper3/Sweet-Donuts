import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from "@angular/forms";
import { ValidationService } from '../../providers/services/validation-service';
import { MainProvider } from '../../providers/main/main';
import { LoginPage } from '../login/login';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';
import { ServicesProvider } from '../../providers/services/services';

/**
 * Generated class for the AccountVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-verification',
  templateUrl: 'account-verification.html',
})
export class AccountVerificationPage {
  userForm: any;
  getAppLogo: string;
  loginType: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder, public main: MainProvider, public ionicComponent: ionicComponents, public rest: ServicesProvider) {
    this.userForm = builder.group({
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      's_key': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(8), ValidationService.keyValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8), ValidationService.passwordValidator])],
      'confirm_password': ['', Validators.compose([Validators.required, Validators.minLength(8), ValidationService.passwordValidator])],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountVerificationPage');
  }
  pop() {
    this.navCtrl.pop();
  }
  onSubmit(value) {

  }
  verify() {
    let isValid = this.checkValidity();
    if (isValid) {
      let body;
      if (this.loginType == 'email') {
        body = { "EmailAddress": this.userForm.controls.email.value, "NewPassword": this.userForm.controls.password.value, "SecretKey": this.userForm.controls.s_key.value };
      }
      else if (this.loginType == 'phone') {
        body = { "CellNumber": this.userForm.controls.email.value, "NewPassword": this.userForm.controls.password.value, "SecretKey": this.userForm.controls.s_key.value };
      }
      else {
        this.ionicComponent.ShowToast("Invalid email/phone or password!");
        return false;
      }

      // let body = { "EmailAddress": this.userForm.controls.email.value, "NewPassword": this.userForm.controls.password.value, "SecretKey": this.userForm.controls.s_key.value };
      if (this.main.isConnected()) {
        this.ionicComponent.ShowLoader();
        this.rest.doResetPassword(body)
          .subscribe(data => {
            console.log("response", data);
            if (data.ResponseHeader.ResponseCode === 1) {
              this.ionicComponent.hideLoader();
              this.ionicComponent.ShowToast("Password changed successfully!")
              this.navCtrl.setRoot(LoginPage);
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
      // http request

    }
    else {
      if (this.userForm.controls.password.value == this.userForm.controls.confirm_password.value) {
        this.ionicComponent.ShowToast("Please enter all required details!")
      }
      else {
        this.ionicComponent.ShowToast("Password and confirm password didn't matched!")
      }

    }


  }
  checkValidity() {
    if (this.userForm.controls.email.value == "" || this.userForm.controls.password.value == "" || this.userForm.controls.s_key.value == "" || this.userForm.controls.confirm_password.value == "") {
      return false;
    }
    else {
      debugger
      if (this.userForm.controls.password.value == this.userForm.controls.confirm_password.value) {
        this.loginType = this.main.checkInputType(this.userForm.controls.email.value);
        return true;
      }
      else {
        return false;
      }

    }
  }

}

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AccountVerificationPage } from '../account-verification/account-verification';
import { MainProvider } from '../../providers/main/main';
import { ForgotPasswordLinkMessagePage } from '../modal/forgot-password-link-message/forgot-password-link-message';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';
import { ServicesProvider } from '../../providers/services/services';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage implements OnInit {

  userForm: any;
  userData = { "email": "" };
  getAppLogo: string;
  loginType: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder, public main: MainProvider,
    public modalCtrl: ModalController, public ionicComponent: ionicComponents, public rest: ServicesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }
  gotoAccountVerificationPage() {
    this.navCtrl.push(AccountVerificationPage);
  }
  pop() {
    this.navCtrl.pop();
  }
  onSubmit(userForm) {

  }
  submit() {
    let isValid = this.checkValidity();
    if (isValid) {
      let body;
      if (this.loginType == 'email') {
        body = { "EmailAddress": this.userForm.controls.email.value };
      }
      else if (this.loginType == 'phone') {
        body = { "CellNumber": this.userForm.controls.email.value };
      }
      else {
        this.ionicComponent.ShowToast("Invalid email/phone or password!");
        return false;
      }
      if (this.main.isConnected()) {
        // http request
        this.ionicComponent.ShowLoader();
        this.rest.forgotPassword(body)
          .subscribe(data => {
            console.log("response", data);
            if (data.ResponseHeader.ResponseCode === 1) {
              this.ionicComponent.hideLoader();
              this.toastPopup();
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
    else {
      this.ionicComponent.ShowToast('Please enter your email/phone!')
    }

  }
  toastPopup() {
    let profileModal = this.modalCtrl.create(ForgotPasswordLinkMessagePage, { loginType: this.loginType });
    profileModal.present();
    profileModal.onDidDismiss(data => {
      this.navCtrl.push(AccountVerificationPage)
    });
  }
  checkValidity() {
    if (this.userForm.controls.email.value == "") {
      return false;
    }
    else {
      this.loginType = this.checkInputType();
      return true;
    }
  }
  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/)]),
    });
  }
  checkInputType() {
    var mail_pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    var phone_patteren = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
    console.log(mail_pattern.test(this.userForm.controls.email.value));
    if (mail_pattern.test(this.userForm.controls.email.value)) {
      return 'email';
    }
    if (phone_patteren.test(this.userForm.controls.email.value)) {
      return 'phone';
    }
    else {
      return 'wrong'
    }
  }
}

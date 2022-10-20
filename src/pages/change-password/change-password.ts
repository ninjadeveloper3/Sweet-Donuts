import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormGroup, FormControl, Validators} from '../../../node_modules/@angular/forms';
import {MainProvider} from '../../providers/main/main';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {ServicesProvider} from '../../providers/services/services';
import {LoginPage} from '../login/login';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage implements OnInit {
  userForm: any;
  userData = {"password": "", "C_password": "", "new_password": ""};
  password: any;
  pass: boolean;
  c_pass: any;
  result: boolean;
  passln: any;
  passresult: boolean;
  cresult: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _cdRef: ChangeDetectorRef, public main: MainProvider,
              public ionicComponent: ionicComponents, public rest: ServicesProvider) {
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      new_password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      C_password: new FormControl('', [Validators.required, Validators.minLength(6)]),

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  onSubmit(value) {

  }

  UpdatePassword() {
    let user = this.main.getItems('userObject');
    let postData = {
      "ID": user.ID,
      "OldPassword": this.userForm.controls.password.value,
      "NewPassword": this.userForm.controls.new_password.value,
    }
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.changePassword(postData)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.ionicComponent.hideLoader();
            this.ionicComponent.ShowToast('Password changed successfully!');
            this.main.removeStorage('userObject');
            this.main.removeStorage('StoreInfo');
            this.main.removeStorage('StoreLocationObj');
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

  }

  pop() {
    this.navCtrl.pop();
  }

  getpassvalue(value) {
    if (value) {
      this._cdRef.detectChanges();
      this.password = value;
      this.passln = value.length < 6;
      if (this.password == this.c_pass) {
        this.result = true;
        this.passresult = false;
        this.cresult = true;
      } else {
        this.result = false;
        this.passresult = false;
      }
    }
  }

  getconfirmpassvalue(value) {
    if (value) {
      this._cdRef.detectChanges();
      this.c_pass = value;
      // check if confirm password enter and password field is empty
      if (this.passln == undefined) {
        this.passresult = true;
        return true;
      }
      if (this.c_pass == this.password) {
        this.cresult = true;
      } else {
        this.cresult = false;
      }
      return true;
    }
  }
}

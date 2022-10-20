import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { ValidationService } from '../../providers/services/validation-service';
import { MainProvider } from '../../providers/main/main';
import { ChangePasswordPage } from '../change-password/change-password';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';
import { ServicesProvider } from '../../providers/services/services';

/**
 * Generated class for the AccountSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-settings',
  templateUrl: 'account-settings.html',
})
export class AccountSettingsPage implements OnInit {
  userForm: any;
  userData = { "fname": "", "lname": "", "email": "", "phone": "", "gender": "", "DOB": "" };
  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder, public main: MainProvider,
    public ionicComponent: ionicComponents, public rest: ServicesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountSettingsPage');
  }
  ionViewWillEnter() {
    let user = this.main.getItems('userObject');
    console.log("loggedin user = ", user);
    if (user !== null) {
      this.userForm.controls['fname'].setValue(user.FirstName);
      this.userForm.controls['lname'].setValue(user.LastName);
      this.userForm.controls['email'].setValue(user.EmailAddress);
      this.userForm.controls['phone'].setValue(user.CellNumber);
      this.userForm.controls['gender'].setValue(user.Gender);
      this.userForm.controls['DOB'].setValue(user.DOB);
    }
  }
  ngOnInit() {
    this.userForm = new FormGroup({
      fname: new FormControl('', [Validators.required, Validators.pattern(/^[-\sa-zA-Z]+$/)]),
      lname: new FormControl('', []),
      email: new FormControl('', []),
      phone: new FormControl('', []),
      gender: new FormControl('', []),
      DOB: new FormControl('', []),
    });
  }
  ChangePass() {
    this.navCtrl.push(ChangePasswordPage)
  }
  Save() {
    let user = this.main.getItems('userObject');
    let postData = {
      "ID": user.ID,
      "FirstName": this.userForm.controls.fname.value,
      "LastName": this.userForm.controls.lname.value,
      "EmailAddress": this.userForm.controls.email.value,
      "CellNumber": this.userForm.controls.phone.value,
      "BirthDate": this.userForm.controls.DOB.value,
      "Gender": this.userForm.controls.gender.value
    }
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.updateProfile(postData)
        .subscribe(data => {
          console.log("response", data);
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.main.storeItems('userObject', data.Customer.CustomerInfo);
            this.ionicComponent.hideLoader();
            this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
            // this.navCtrl.push(PhoneVerificationPage, { 'customer': data.Customer });
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
  onSubmit(value) {

  }


}

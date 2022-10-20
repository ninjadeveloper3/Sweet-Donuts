import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from '../../providers/services/validation-service';
import {PhoneVerificationPage} from '../phone-verification/phone-verification';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {ServicesProvider} from '../../providers/services/services';
import {AccountVerificationPage} from '../account-verification/account-verification';
import {MainProvider} from '../../providers/main/main';


/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage implements OnInit {
  userForm: any;
  userData = {
    "fname": "",
    "lname": "",
    "email": "",
    "password": "",
    "C_password": "",
    "phone": "",
    "gender": "",
    "DOB": ""
  };
  webkitReleased = '1998-11-04T11:06Z';
  cdRef: any;
  passln: any;
  val: any;
  c_pass: boolean;
  cpass: any;
  password: any;
  result: boolean;
  cresult: boolean;
  passresult: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder, public ionicComponent: ionicComponents,
              public rest: ServicesProvider, private _cdRef: ChangeDetectorRef, public main: MainProvider) {
  }

  onSubmit(value) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  pop() {
    this.navCtrl.pop();
  }

  gotoPhoneVerification() {
    let isValid = this.isValue();
    if (isValid) {
      let gender_val = this.userForm.controls.gender.value;
      let dob_val = this.userForm.controls.DOB.value;
      if (gender_val == undefined) {
        gender_val = null;
      }
      if (dob_val == undefined) {
        dob_val = null;
      }
      let postData = {
        "FirstName": this.userForm.controls.fname.value,
        "LastName": this.userForm.controls.lname.value,
        "EmailAddress": this.userForm.controls.email.value,
        "Password": this.userForm.controls.password.value,
        "CellNumber": this.userForm.controls.phone.value,
        "Gender": gender_val,
        "BirthDate": dob_val
      }
      console.log("Gender", this.userForm.controls.gender.value)
      console.log("DOB", this.userForm.controls.DOB.value)
      console.log("user data signup", postData);
      if (this.main.isConnected()) {
        this.ionicComponent.ShowLoader();
        this.rest.doSignUp(postData)
          .subscribe(data => {
            console.log("response", data);
            if (data.ResponseHeader.ResponseCode === 1) {
              debugger
              console.log(data)
              this.ionicComponent.hideLoader();
              this.ionicComponent.ShowToast('Verification Code has been sent to your email/phone.')
              this.navCtrl.push(PhoneVerificationPage, {'customer': data.Customer});
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
      this.ionicComponent.ShowToast('Please fill all the required fields!')
    }

  }

  isValue() {
    if (this.userForm.controls.fname.value == "" || this.userForm.controls.email.value == "" || this.userForm.controls.phone.value == "" || this.userForm.controls.password.value == "" || this.userForm.controls.C_password.value == "") {
      return false;
    }
    else {
      return true;
    }
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      fname: new FormControl('', [Validators.required, Validators.pattern(/^[-\sa-zA-Z]+$/)]),
      lname: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]),
      password: new FormControl('', [Validators.required]),
      C_password: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/)]),
      gender: new FormControl('', []),
      DOB: new FormControl('', []),
    });
  }

  //validate the number

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

import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import {ValidationService} from '../../providers/services/validation-service';
import {MainProvider} from '../../providers/main/main';
import {ServicesProvider} from '../../providers/services/services';

declare var kommunicate: any;
declare var cordova: any;
declare var intercom: any;

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage implements OnInit {
  UID1: string = "Moiz";
  UID2: string = "SUPERHERO2";
  isLoading: boolean = false;
  disableInitialize: boolean = false;
  disableSuperHero1: boolean = true;
  disableSuperHero2: boolean = true;
  disableLaunch: boolean = true;
  // chat_friends = '2,3,4,5,6';
  // ----------------
  selected: any;
  feedback: number[];
  userData = {"email": "", "cell": "", "feedback": ""};
  sec: boolean = false;
  addresses_country: any;
  addresses_state: any;
  edit_address: any = null;
  userForm: any;
  information: any;
  currentNumber: number = 0;
  local_storage_user: any;
  StoreId: any;
  Storecontact: any;
  StoreCell: any;
  showDefaultInfo: boolean = true;
  StoreEmail: any;
  licenseKey = "COMETCHAT-1XSIE-2UI6G-Y3D1L-94HMY";
  apiKey = "51499x5094b0c302cf0b4e5b7e946aa5c405cd";
  userID: any;
  userName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ref: ChangeDetectorRef, public viewCtrl: ViewController, public rest: ServicesProvider, public ionicComponent: ionicComponents, public builder: FormBuilder, public main: MainProvider) {
    var __this = this;
    debugger
    let loggedInUser = this.main.getItems('userObject');
    let PlayerId = this.main.getItems('deviceID');
    console.log("user : ", this.main.getItems('userObject'));
    console.log("player id : ", PlayerId); //PlayerId.userId
    // Comit chat init start

    // Comit chat init end
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]),
      cell: new FormControl('', [Validators.required, Validators.pattern(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/)]),
      feedback: new FormControl('', []),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAddressPage');
    // store object
    this.local_storage_user = this.main.getItems('StoreObj');
    if (this.local_storage_user !== null) {
      this.StoreId = this.local_storage_user.ID;
      if (this.main.isConnected()) {
        this.ionicComponent.ShowLoader(); //CustomerId, ProductId, SellerId, StoreId
        this.rest.GetStoreInfo(this.StoreId)
          .subscribe(data => {
            if (data.ResponseHeader.ResponseCode === 1) {
              this.showDefaultInfo = false;
              this.Storecontact = data.ResponseResult.Store.PhoneNo;
              this.StoreCell = data.ResponseResult.Store.CellNo;
              this.StoreEmail = data.ResponseResult.Store.Email;
              console.log("store data", data.ResponseResult.Store);
              this.ionicComponent.hideLoader();
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
    }

  }

  contactfeedback() {
    let postData = {
      "StoreID": this.StoreId,
      "Email": this.userForm.controls.email.value,
      "PhoneNumber": this.userForm.controls.cell.value,
      "FeedBack": this.userForm.controls.feedback.value
    }
    console.log("contact data feedback", postData);
    if (this.main.isConnected()) {
      this.ionicComponent.ShowLoader();
      this.rest.contactfeedbackdata(postData)
        .subscribe(data => {
          console.log("hamza response", data);
          if (data.ResponseHeader.ResponseCode === 1) {
            this.ionicComponent.hideLoader();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
            this.ionicComponent.ShowToast("Query sent successfully!");
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
    console.log("contact value", value);
  }

  createCometChatUser(uid, name) {
    debugger
    var __this = this;
    var data = new FormData();
    data.append("UID", uid);
    data.append("name", name);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    xhr.open("POST", "https://api.cometondemand.net/api/v2/createUser");
    xhr.setRequestHeader("api-key", __this.apiKey);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
  }

  LiveChat() {
    // this.startNew();
    intercom.displayMessenger();

  }

  public getRandomId(): string {
    let PlayerId = this.main.getItems('deviceID');
    let loggedInUser = this.main.getItems('userObject');
    let userID = "";
    if (loggedInUser) {
      userID = loggedInUser.ID;
      return userID;
    }
    var str = PlayerId.deviceID;
    var res1 = str.substring(0, 3);
    var res2 = str.slice(-2);
    var guestId = res1 + res2;
    userID = guestId;
    return userID;
  }

  startNew() {
    debugger
    let loggedInUser = this.main.getItems('userObject');
    if (loggedInUser) {
      debugger
      // We're logged in, we can register the user with Intercom
      intercom.registerIdentifiedUser({userId: loggedInUser.ID});
      intercom.updateUser({email: loggedInUser.EmailAddress, name: loggedInUser.FirstName});
      intercom.displayMessenger();
    } else {
      intercom.registerUnidentifiedUser();
      intercom.displayMessenger();
    }
  }

  ionViewWillLeave() {
    // intercom.logout();
  }
}

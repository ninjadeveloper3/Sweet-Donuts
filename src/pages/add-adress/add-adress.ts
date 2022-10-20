import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events, Searchbar } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../providers/services/validation-service';
import { ionicComponents } from '../../providers/ionic-components/ionic-components';
import { ServicesProvider } from '../../providers/services/services';
import { MainProvider } from '../../providers/main/main';
import { Geolocation } from '@ionic-native/geolocation';
declare var google;

/**
 * Generated class for the AddAdressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-adress',
  templateUrl: 'add-adress.html',
})
export class AddAdressPage implements OnInit {
  @ViewChild('mySearchbar') searchbar: Searchbar;
  userForm: FormGroup;
  userData = { "home": "", "fname": "", "street": "", "phone": "", "zip": "", "city": "" };
  selected: any;
  sec: boolean = false;
  addresses_country: any;
  addresses_state: any;
  edit_address: any = null;
  information: any;
  currentNumber: number = 0;
  geocoder: any;
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  autocomplete: { input: string };
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public builder: FormBuilder,
    public ionicComponent: ionicComponents, public rest: ServicesProvider, public main: MainProvider, public events: Events, 
    private geolocation: Geolocation,public zone: NgZone) {
    this.edit_address = this.navParams.get('EditAddress');
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    // Edit address 
    this.userForm = builder.group({
      'home': ['', [Validators.required]],
      'fname': ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      'street': ['', [Validators.required]],
      'phone': ['', [Validators.required, ValidationService.phoneValidator]],
      'zip': ['', []],
      'city': ['', [Validators.required]],
    })
  }
  ionViewWillEnter() {
    this.geocoder = new google.maps.Geocoder;
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  }
  ionViewDidLoad() {
    if (this.edit_address !== null && this.edit_address !== undefined) {
      if (this.edit_address.ZipCode == 0) {
        this.edit_address.ZipCode = "";
      }
      this.userForm.controls['home'].setValue(this.edit_address.Apartment);
      this.userForm.controls['fname'].setValue(this.edit_address.FirstName);
      this.userForm.controls['street'].setValue(this.edit_address.Street);
      this.userForm.controls['phone'].setValue(this.edit_address.CellNo);
      this.userForm.controls['zip'].setValue(this.edit_address.ZipCode);

    }
    console.log('ionViewDidLoad AddAddressPage');
  }
  ionViewWillLeave() {
    this.events.publish('reloadPageMyAddresses');
  }
  onSubmit(value) {

  }
  pop() {
    this.navCtrl.pop();
  }

  save() {
    let user = this.main.getItems('userObject');
    debugger
    if (this.edit_address == null || this.edit_address == undefined) {
      // data Modal
      let zip = this.userForm.controls.zip.value;
      if (zip == "") {
        zip = null;
      }

      if (user) {
        let body = {
          "CustomerID": user.ID,
          "FirstName": this.userForm.controls.fname.value,
          "Apartment": this.userForm.controls.home.value,
          "Street": this.userForm.controls.street.value,
          "CellNo": this.userForm.controls.phone.value,
          "City": 'Karachi',
          "ZipCode": zip
        };
        if (this.main.isConnected()) {
          // http request
          this.ionicComponent.ShowLoader();
          this.rest.Addaddress(body)
            .subscribe(data => {
              console.log("response", data);
              if (data.ResponseHeader.ResponseCode === 1) {
                this.ionicComponent.hideLoader();
                this.pop();
              }
              else {
                this.ionicComponent.hideLoader();
                this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
                this.pop();
              }
            });
        }
        else {
          this.ionicComponent.ShowToast("No Internet Connection!");
        }
      }
      else {
        this.ionicComponent.ShowToast("Please login first to perform this action!")
      }
    }
    else {
      this.editAddressApi(user);
    }



  }
  editAddressApi(user) {
    let zip = this.userForm.controls.zip.value;
    if (zip == 0) {
      zip = null;
    }
    let body = {
      "CustomerID": user.ID,
      "FirstName": this.userForm.controls.fname.value,
      "Apartment": this.userForm.controls.home.value,
      "Street": this.userForm.controls.street.value,
      "CellNo": this.userForm.controls.phone.value,
      "City": 'Karachi',
      "ZipCode": zip,
      "ID": this.edit_address.ID
    };
    if (this.main.isConnected()) {
      // http request
      this.ionicComponent.ShowLoader();
      this.rest.updateAddress(body)
        .subscribe(data => {
          console.log("response", data);
          if (data.ResponseHeader.ResponseCode === 1) {
            this.ionicComponent.hideLoader();
            this.pop();
          }
          else {
            this.ionicComponent.hideLoader();
            this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
            this.pop();
          }
        });
    }
    else {
      this.ionicComponent.ShowToast("No Internet Connection!");
    }
  }
  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.userForm = new FormGroup({
      home: new FormControl('', [Validators.required]),
      fname: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      street: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/), Validators.maxLength(13)]),
      zip: new FormControl('', [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(5)]),
      city: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)]),
    });
  }
  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({
      input: this.autocomplete.input, componentRestrictions: {
        country: 'pk'
      }
    },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }
  selectSearchResult(item) {
      this.autocompleteItems = [];
      this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
        if (status === 'OK' && results[0]) {
          this.main.storeItems('StoreLocationObj', results[0]);
          this.searchbar.setValue(results[0].formatted_address);
        }
      })
    
  }
  useCurrentLocation() {
    console.log("use current loc");
    this.ionicComponent.ShowLoader();
    debugger
    let MycurrentLocatin = this.geolocation.getCurrentPosition().then((resp) => {
      console.log("location", resp.coords)
      let latlng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let request = { location: latlng };
      this.geocoder.geocode({ 'location': latlng }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {

          let result = results[0].formatted_address;
          if (result != null) {
            // this.marker.buildingNum = rsltAdrComponent[resultLength - 8].short_name;
            // this.marker.streetName = rsltAdrComponent[resultLength - 7].short_name;
            this.userForm.controls['street'].setValue(result);
            this.ionicComponent.hideLoader();
          } else {
            this.ionicComponent.hideLoader();
            this.ionicComponent.ShowToast("No address available!");
          }
        }
        else {
          this.ionicComponent.hideLoader();
          this.ionicComponent.ShowToast('Error getting your current location');
        }
      });

    }).catch((error) => {
      console.log('Error getting location', error);
      this.ionicComponent.ShowToast("Please turn on your location setting");
      this.ionicComponent.hideLoader();
    });
    console.log("current location result", MycurrentLocatin);
  }
}

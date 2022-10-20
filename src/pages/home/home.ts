import {Component, ElementRef, NgZone, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';
import {IonicPage, ModalController, NavController, Searchbar, Slides, Keyboard, AlertController} from 'ionic-angular';
import {Connectivity} from '../../providers/connectivity-service/connectivity-service';
import {ionicComponents} from '../../providers/ionic-components/ionic-components';
import {AllCategoriesPage} from '../all-categories/all-categories';
import {ServicesProvider} from '../../providers/services/services';
import {MainProvider} from '../../providers/main/main';
import {ComboDetailsPage} from '../combo-details/combo-details';
import moment from 'moment';
import {StoreTimingsPage} from '../store-timings/store-timings';
import {OrderHistoryPage} from '../order-history/order-history';
import {MyCartPage} from '../my-cart/my-cart';
import {Diagnostic} from '@ionic-native/diagnostic';

declare var google;
declare var CCCometChat: any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  slides: any;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('mySearchbar') searchbar: Searchbar;
  @ViewChild(Slides) slider: Slides;
  // veriable declareation 
  geocoder: any;
  autocompleteItems: any[];
  autocomplete: { input: string };
  GoogleAutocomplete: any;
  map: any;
  comboBanner: string = 'assets/Sweet_Donuts_images/Home/bottom-slider.png';
  BannerImages: any;
  imgPathServer: string;
  showDummyBanner: boolean = true;

  constructor(public navCtrl: NavController, public connectivity: Connectivity, public ionicComponent: ionicComponents, public zone: NgZone,
              private geolocation: Geolocation, public modalCtrl: ModalController, public keyboard: Keyboard, public rest: ServicesProvider,
              public main: MainProvider, private ref: ChangeDetectorRef, public alertCtrl: AlertController, public diagnostic: Diagnostic) {
    this.autocomplete = {input: ''};
    this.autocompleteItems = [];
    this.BannerImages = [{key: 1}]
    this.imgPathServer = this.rest.imagesURL;

  }

  ionViewWillEnter() {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder;
    // console.log("network state is : ", this.main.isConnected());
    this.loadMap();
  }

  // -------------Maps-----------------
  loadMap() {
    this.ionicComponent.ShowLoader();
    let selectedStore = this.main.getItems('StoreLocationObj');
    if (selectedStore !== null) {
      this.searchbar.setValue(selectedStore.formatted_address);
      let location = new google.maps.LatLng(selectedStore.geometry.location.lat, selectedStore.geometry.location.lng);
      let mapOptions = {
        center: location,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      if (location) {
        this.ionicComponent.hideLoader();
        this.doGetStoreByCurrentLocation(selectedStore.geometry.location.lat, selectedStore.geometry.location.lng, mapOptions, location);
      }
    }
    else {
      this.diagnostic.isLocationEnabled().then((enabled) => {
        console.log("Location is " + enabled);
        if (enabled) {
          let MycurrentLocatin = this.geolocation.getCurrentPosition().then((resp) => {
            console.log("location", resp.coords)
            let location = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            let mapOptions = {
              center: location,
              zoom: 15,
              enableHighAccuracy: true,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            if (location) {
              this.geocoder.geocode({'location': location}, (results, status) => {
                if (status === 'OK' && results[0]) {
                  // this.main.storeItems('StoreLocationObj', results[0]);
                  this.searchbar.setValue(results[0].formatted_address);
                }
              })
              this.ionicComponent.hideLoader();
              this.doGetStoreByCurrentLocation(resp.coords.latitude, resp.coords.longitude, mapOptions, location);
            }

          }).catch((error) => {
            console.log('Error getting location', error);
            this.ionicComponent.ShowToast("Please turn on your location setting to view store on map!");
            this.ionicComponent.hideLoader();
          });
        }
        else {
          // this.diagnostic.switchToLocationSettings();
          this.ionicComponent.hideLoader();
          this.ionicComponent.ShowToast("Please turn on your location setting to view store on map!");
        }
      });


    }
  }

  // *************Map marker*********************
  addMarker(Store, location) {
    new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: location
    });
    if (Store) {
      let store_latlong = new google.maps.LatLng(Store.Latitude, Store.Longitude, 17);
      this.addStoremarker(store_latlong, Store);
    }
  }

  // ***************Store Marker***************
  addStoremarker(store_latlong, Store) {
    var icon = {
      url: 'assets/Sweet_Donuts_images/Home/dd-pin.png'
    };
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: store_latlong,
      icon: icon
    });
  }

  // -----------------------------------
  // -----------search places-----------
  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      this.main.removeStorage('StoreLocationObj');
      this.main.removeStorage('StoreObj');
      this.mapClick();
      // this.loadMap();
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
    let cartData = this.main.getItems('localCartData');
    if (cartData == null || cartData.length == 0) {
      this.autocompleteItems = [];
      this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
        if (status === 'OK' && results[0]) {
          this.main.storeItems('StoreLocationObj', results[0]);
          this.searchbar.setValue(results[0].formatted_address);
          let position = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          let location = new google.maps.LatLng(position.lat, position.lng);
          let mapOptions = {
            center: location,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          this.doGetStoreByCurrentLocation(position.lat, position.lng, mapOptions, location)
        }
      })
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Confirm Alert',
        message: 'Changing delivery address would empty your cart',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Confirm',
            handler: () => {
              this.main.removeStorage('localCartData');
              this.autocompleteItems = [];
              this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
                if (status === 'OK' && results[0]) {
                  this.main.storeItems('StoreLocationObj', results[0]);
                  this.searchbar.setValue(results[0].formatted_address);
                  let position = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                  };
                  let location = new google.maps.LatLng(position.lat, position.lng);
                  let mapOptions = {
                    center: location,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                  }
                  this.doGetStoreByCurrentLocation(position.lat, position.lng, mapOptions, location)
                }
              })
            }
          }
        ]
      });
      alert.present();
    }


  }

  // Current location----------
  current_location() {
    debugger
    console.log("clicked!");
    let cartData = this.main.getItems('localCartData')
    if (cartData == null || cartData.length == 0) {
      this.autocompleteItems = [];
      this.searchbar.setValue('');
      this.mapClick();
      this.main.removeStorage('StoreLocationObj')
      this.loadMap();
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Confirm Alert',
        message: 'Changing delivery address would empty your cart',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Confirm',
            handler: () => {
              this.autocompleteItems = [];
              this.searchbar.setValue('');
              this.mapClick();
              this.main.removeStorage('StoreLocationObj');
              this.main.removeStorage('localCartData');
              this.loadMap();
            }
          }
        ]
      });
      alert.present();
    }
  }

  // --------------buttons selection------------
  gotoCategories() {
    this.navCtrl.setRoot(AllCategoriesPage);
  }

  gotoOrder() {
    let storeSelected = this.main.getItems('StoreObj');
    if (storeSelected !== null) {
      let local_storage_store = this.main.getItems('StoreObj');
      let CurrentTime = new Date().toLocaleTimeString();
      let StoreOpeningTime = local_storage_store.StartTime;
      let StoreEndTime = local_storage_store.EndTime;
      var format = 'hh:mm a'
      var time = moment('' + CurrentTime + '', format),
        beforeTime = moment('' + StoreOpeningTime + '', format),
        afterTime = moment('' + StoreEndTime + '', format);
      console.log("current time", CurrentTime, "open time", StoreOpeningTime, "close time", StoreEndTime);
      // current time 5:37:47 PM open time 9:00 AM close time 11:00 PM
      //Store Openning Time 
      if (!time.isBetween(beforeTime, afterTime)) {
        console.log('is not between');
        let timings = {
          openTime: StoreOpeningTime,
          closeTime: StoreEndTime
        }
        this.navCtrl.push(StoreTimingsPage, {'timings': timings})
        // this.ionicComponent.showAlert('Alert', 'Sorry, we are closed at the moment.Try again between 8 am to 12 am');
      }
      else {
        this.navCtrl.setRoot(AllCategoriesPage);
      }

    }
    else {
      this.ionicComponent.ShowToast("Oops we couldn’t find your location, please find another delivery point.");
    }
  }

  mapClick() {
    if (this.keyboard.isOpen()) {
      this.keyboard.close();
      console.log("keyboard open true");
    }

  }

  gotoDeal(deal) {
    debugger
    let local_storage_store = this.main.getItems('StoreObj');
    let CurrentTime = new Date().toLocaleTimeString();
    let StoreOpeningTime = local_storage_store.StartTime;
    let StoreEndTime = local_storage_store.EndTime;
    var format = 'hh:mm a'
    var time = moment('' + CurrentTime + '', format),
      beforeTime = moment('' + StoreOpeningTime + '', format),
      afterTime = moment('' + StoreEndTime + '', format);
    console.log("current time", CurrentTime, "open time", StoreOpeningTime, "close time", StoreEndTime);
    // current time 5:37:47 PM open time 9:00 AM close time 11:00 PM
    //Store Openning Time 
    if (!time.isBetween(beforeTime, afterTime)) {
      console.log('is not between');
      let timings = {
        openTime: StoreOpeningTime,
        closeTime: StoreEndTime
      }
      this.navCtrl.push(StoreTimingsPage, {'timings': timings})
      // this.ionicComponent.showAlert('Alert', 'Sorry, we are closed at the moment.Try again between' + StoreOpeningTime + ' to ' + StoreEndTime);
    }
    else {
      let store_id = this.main.getItems('StoreObj').ID;
      this.ionicComponent.ShowLoader();
      this.rest.doGetDealById(deal.ID, store_id)
        .subscribe(data => {
          if (data.ResponseHeader.ResponseCode === 1) {
            console.log(data);
            this.ionicComponent.hideLoader();
            this.navCtrl.push(ComboDetailsPage, {'combo': data.ResponseResult.DealDetail});
          }
          else {
            this.ionicComponent.hideLoader();
            this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
          }
        });
    }

  }

  dummyBanner() {
    this.ionicComponent.ShowToast("Sorry! there is no available store nearby your selected location")
  }

  doGetStoreByCurrentLocation(lat, long, mapOptions, location) {
    this.ionicComponent.ShowLoader();
    this.rest.doGetStoresByLocation(lat, long)
      .subscribe(data => {

        if (data.ResponseHeader.ResponseCode === 1) {
          console.log(data);
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          this.main.storeItems('StoreObj', data.ResponseResult.Store);

          if (data.ResponseResult.Store !== null) {
            this.main.storeItems('TaxModal', data.ResponseResult.Store.OrderSettings);
            this.doGetBanners(data.ResponseResult.Store);
          }
          else {
            this.showDummyBanner = true;
            this.comboBanner = this.imgPathServer + data.ResponseResult.DefaultBanner;
            console.log("default banner image url : ", this.comboBanner);
            this.ionicComponent.hideLoader();
          }
          this.addMarker(data.ResponseResult.Store, location);
        }
        else {
          this.ionicComponent.hideLoader();
          this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
        }
      });

  }

  setocart() {
    let storeSelected = this.main.getItems('StoreObj');
    if (storeSelected !== null) {
      let local_storage_store = this.main.getItems('StoreObj');
      let CurrentTime = new Date().toLocaleTimeString();
      let StoreOpeningTime = local_storage_store.StartTime;
      let StoreEndTime = local_storage_store.EndTime;
      var format = 'hh:mm a'
      var time = moment('' + CurrentTime + '', format),
        beforeTime = moment('' + StoreOpeningTime + '', format),
        afterTime = moment('' + StoreEndTime + '', format);
      console.log("current time", CurrentTime, "open time", StoreOpeningTime, "close time", StoreEndTime);
      // current time 5:37:47 PM open time 9:00 AM close time 11:00 PM
      //Store Openning Time 
      if (!time.isBetween(beforeTime, afterTime)) {
        console.log('is not between');
        let timings = {
          openTime: StoreOpeningTime,
          closeTime: StoreEndTime
        }
        this.navCtrl.push(StoreTimingsPage, {'timings': timings})
        // this.ionicComponent.showAlert('Alert', 'Sorry, we are closed at the moment.Try again between 8 am to 12 am');
      }
      else {
        this.navCtrl.setRoot(MyCartPage)
      }

    }
    else {
      this.ionicComponent.ShowToast("Location not found. Please try another location.");
    }

  }

  doGetBanners(Store) {
    this.rest.doGetBannerImages(Store.ID)
      .subscribe(data => {
        if (data.ResponseHeader.ResponseCode === 1) {
          this.ionicComponent.hideLoader();
          console.log(data);
          this.showDummyBanner = false;
          this.BannerImages = data.ResponseResult.AllDeals;
          let temp_noti = this.main.getSessionStorage('notificationOpened');
          if (temp_noti) {
            if (temp_noti.title == 'DELIVERED') {
              this.main.StoreSessionStorage('notification', true);
              this.navCtrl.setRoot(OrderHistoryPage, {'noti': true});
              // this.nav.push(FoodFeedbackPage);
            }
            else {
              this.navCtrl.setRoot(OrderHistoryPage);
            }
          }
        }
        else {
          this.ionicComponent.hideLoader();
          this.ionicComponent.ShowToast(data.ResponseHeader.ResponseMessage);
        }
      });

  }

  encodeURL(base, uri) {
    let url = base + uri;
    return encodeURI(url);
  }
}


import {Component, ViewChild} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Keyboard} from '@ionic-native/keyboard';
import {Nav, Platform, AlertController} from 'ionic-angular';
import {AccountSettingsPage} from '../pages/account-settings/account-settings';
import {AllCategoriesPage} from '../pages/all-categories/all-categories';
import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {MyAddressesPage} from '../pages/my-addresses/my-addresses';
import {MyCartPage} from '../pages/my-cart/my-cart';
import {MyFavouritesPage} from '../pages/my-favourites/my-favourites';
import {OrderHistoryPage} from '../pages/order-history/order-history';
import {NetworkProvider} from '../providers/network/network';
import {ContactUsPage} from '../pages/contact-us/contact-us';
import {Events} from 'ionic-angular';
import {MainProvider} from '../providers/main/main';
import {ionicComponents} from '../providers/ionic-components/ionic-components';
import {OneSignal} from '@ionic-native/onesignal';
import moment from 'moment';
import {StoreTimingsPage} from '../pages/store-timings/store-timings';
import {ServicesProvider} from '../providers/services/services';
import {Network} from '@ionic-native/network';
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {AppVersion} from '@ionic-native/app-version';
import {Market} from '@ionic-native/market';
import {ImageLoaderConfig} from 'ionic-image-loader';

declare var intercom: any;


@Component({
  templateUrl: 'app.html',
  providers: [NetworkProvider]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  showedAlert: boolean;
  showButton: boolean = false;
  isNewVersionAvailable: boolean = false;
  sender_id = '687419314221';
  oneSignalAppId = '8c8c9a25-6f2b-4edf-8eb7-2282747652ba';

  pages: ({ title: string; component: typeof HomePage; name: string; } | { title: string; component: typeof AllCategoriesPage; name: string; } | { title: string; component: typeof MyCartPage; name: string; } | { title: string; component: typeof AccountSettingsPage; name: string; } | { title: string; component: typeof OrderHistoryPage; name: string; } | { title: string; component: typeof MyAddressesPage; name: string; } | { title: string; component: typeof MyFavouritesPage; name: string; } | { title: string; component: typeof ContactUsPage; name: string; })[];
  appFocus: boolean = false;
  confirmAlert: any;


  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public networkProvider: NetworkProvider,
              public keyboard: Keyboard, public events: Events, public main: MainProvider, public ionicComponent: ionicComponents, public oneSignal: OneSignal,
              public alertCtrl: AlertController, public rest: ServicesProvider, public network: Network, private ga: GoogleAnalytics,
              private appVersion: AppVersion, private market: Market, private imageLoaderConfig: ImageLoaderConfig) {
    if (this.platform.is('android')) {
      this.oneSignalInit();
    }

    // one signal Code
    this.initializeApp();
    let local_storage_user = this.main.getItems('userObject');
    console.log("local storage user ", local_storage_user);
    if (local_storage_user != null) {
      this.rootPage = HomePage;
      this.showButton = true      // will show the log out button now
    }
    else {
      this.rootPage = LoginPage;
    }
    this.network.onDisconnect().subscribe(state => {
      this.ionicComponent.ShowToast("No Internet Connection");
    });
    this.events.subscribe('loggedinGuest', () => {
      if (this.main.getItems('userObject')) {
        this.showButton = true      // will show the log out button now
        this.oneSignal.setSubscription(true);
      }
      else {
        this.showButton = false;
      }
    });
    this.setImageLoaderConfig();
    this.pages = [
      {title: 'Home', component: HomePage, name: 'HomePage'},
      {title: 'Place an Order', component: AllCategoriesPage, name: 'AllCategoriesPage'},
      {title: 'My Cart', component: MyCartPage, name: 'MyCartPage'},
      {title: 'My Account', component: AccountSettingsPage, name: 'AccountSettingsPage'},
      {title: 'My Orders', component: OrderHistoryPage, name: 'OrderHistoryPage'},
      {title: 'My Addresses', component: MyAddressesPage, name: 'MyAddressesPage'},
      {title: 'My Favorites', component: MyFavouritesPage, name: 'MyFavouritesPage'},
      {title: 'Contact Us', component: ContactUsPage, name: 'ContactUsPage'},
    ];
  }

  ionViewWillLoad() {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.showedAlert = false;
      this.ga.startTrackerWithId('UA-125637748-1')
        .then(() => {
          console.log('Google analytics is ready now');
          // Tracker is ready
          // You can now track pages or set additional information such as AppVersion or UserId
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
      // this.splashScreen.hide();
      // this.setVersionCode();
      this.checkForAppUpdate();
      let loggedInUser = this.main.getItems('userObject');
      if (loggedInUser) {
        console.log("user loggedin : ", loggedInUser);
        debugger
        // We’re logged in, we can register the user with Intercom
        intercom.registerIdentifiedUser({userId: loggedInUser.ID});
        intercom.updateUser({email: loggedInUser.EmailAddress, name: loggedInUser.FirstName});

      } else {
        console.log("Guest user : ", loggedInUser);
        intercom.registerUnidentifiedUser();
      }
      this.platform.registerBackButtonAction(() => {
        debugger
        if (this.isNewVersionAvailable) {
          this.isNewVersionAvailable = false;
          this.platform.exitApp();
          return;
        }
        if (this.nav.length() == 1) {
          if (!this.showedAlert) {
            this.confirmExitApp();
          } else {
            this.showedAlert = false;
            this.confirmAlert.dismiss();
          }
        }
        else {
          this.nav.pop();
        }


      });
      this.keyboard.disableScroll(true);

      this.oneSignalInit();
    });
  }

  oneSignalInit() {
    if ((<any>window).cordova) {
      if (this.main.getItems('pageName')) {
        this.main.removeStorage('pageName');
      }
      this.oneSignal.startInit(this.oneSignalAppId, this.sender_id);
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data));
      this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data));
      this.oneSignal.getIds().then((id) => {
        console.log(id);
        this.storeDeviceId(id);
      });
      this.oneSignal.endInit();

    }
  }

  private setVersionCode() {
    this.rest.setAppVersion(2)
      .subscribe(data => {
        console.log(data);
      });
  }

  private checkForAppUpdate() {
    this.appVersion.getVersionCode().then(ver => {
      console.log("Sweet App getVersionCode>>", ver)
      this.getAppVersion(ver);
    }).catch(function (error) {
      console.log(error);
    });
  }

  private getAppVersion(installedVersion) {
    this.rest.getAppVersion()
      .subscribe(data => {
        console.log("Sweet App server version", data.ExistingVersion);
        if (data.ResponseHeader.ResponseCode === 1) {
          if (data.ExistingVersion > installedVersion) {
            this.isNewVersionAvailable = true;
            let alert = this.alertCtrl.create({
              title: 'New Version Available',
              message: 'An update is available with new feature, a faster experience, fixes and moew.',
              enableBackdropDismiss: false,
              buttons: [
                {
                  text: 'LATER',
                  role: 'LATER',
                  handler: () => {
                    this.isNewVersionAvailable = false;
                    if (!this.platform.is('ios')) {
                      this.platform.exitApp();
                    }

                  }
                },
                {
                  text: 'UPDATE',
                  handler: () => {
                    this.isNewVersionAvailable = false;

                    if (this.platform.is('ios')) {
                      let appId = "id1437387368"
                      this.market.open(appId);

                    } else {
                      this.platform.exitApp();
                      this.market.open('com.Sweetdonuts.app');
                    }
                  }
                }
              ]
            });
            alert.present();
          }
        }
      });
  }

  private onPushReceived(data) {
    console.log("Notiifcatin Recived form one signal>>>");
    this.appFocus = data.isAppInFocus;
  }

  private onPushOpened(data) {
    this.main.StoreSessionStorage('notificationOpened', data.notification.payload);
    if (this.nav.getActive().name == 'HomePage' && this.appFocus == true) {
      this.nav.setRoot(HomePage);
    }
    else if (this.main.getItems('pageName') == 'OrderHistory') {
      if (data.notification.payload.title == 'DELIVERED') {
        this.main.StoreSessionStorage('notification', true);
        this.nav.setRoot(OrderHistoryPage, {'noti': true});
      }
      else {
        this.nav.setRoot(OrderHistoryPage);
      }
    }
    else {
      console.log("condition 3", this.appFocus)
      if (this.appFocus) {
        console.log("pos6");
        this.nav.setRoot(HomePage);
      }
      else {
      }

    }
  }

  storeDeviceId(dvcID) {
    console.log("storeDeviceId load");
    console.log("temp noti after", dvcID);
    let OS = null;
    if (this.platform.is('android')) {
      OS = 'Android';
    }
    else {
      OS = 'iOS';
    }
    let deviceObj = {
      deviceID: dvcID.userId,
      deviceType: OS
    }
    this.main.storeItems('deviceID', deviceObj);
  }

  openPage(page) {
    debugger
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log("page = ", page.component);
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
      if (!time.isBetween(beforeTime, afterTime)) {
        console.log('is not between');
        let timings = {
          openTime: StoreOpeningTime,
          closeTime: StoreEndTime
        }
        this.nav.push(StoreTimingsPage, {'timings': timings})
      }
      else {
        this.nav.setRoot(page.component);
      }

    }
    else if (page.name == "ContactUsPage" || page.name == 'HomePage' || page.name == 'AccountSettingsPage') {
      this.nav.setRoot(page.component);
    }
    else {
      this.ionicComponent.ShowToast("Sorry! there is no available store nearby your selected location");
    }

  }

  confirmExitApp() {
    debugger
    this.showedAlert = true;
    this.confirmAlert = this.alertCtrl.create({
      title: "Exit",
      message: "Are you sure you want to exit?",
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.showedAlert = false;
            return true;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.confirmAlert.present();
  }

  login() {
    this.nav.setRoot(LoginPage);
  }

  logout() {
    let alert = this.ionicComponent.ConfirmAlert('Logout', 'Are you sure you want to log out?', 'Log Out');
    alert.present();
    alert.onDidDismiss((data) => {
      if (data == true) {
        let data = {
          CustomerID: this.main.getItems('userObject').ID,
          DeviceID: this.main.getItems('deviceID').deviceID
        }
        if (this.main.isConnected()) {
          this.ionicComponent.ShowLoader();
          this.rest.logout(data)
            .subscribe(data => {
              console.log("response", data);
              if (data.ResponseHeader.ResponseCode === 1) {
                this.ionicComponent.hideLoader();
                console.log(data);
                // intercom.logout();
                this.main.removeStorage('userObject');
                this.main.removeStorage('StoreInfo');
                this.main.removeStorage('StoreLocationObj');
                this.main.removeStorage('PromoCode');
                this.oneSignal.setSubscription(false);
                this.oneSignal.clearOneSignalNotifications();
                this.nav.setRoot(LoginPage);
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
    });
  }

  fontWeight(p) {
    if (p.component == AllCategoriesPage) {
      return "bold";
    }
    else {
      return "100";
    }
  }

  setImageLoaderConfig() {
    this.imageLoaderConfig.enableDebugMode();
    this.imageLoaderConfig.enableSpinner(false); // disable spinner by default
    this.imageLoaderConfig.setDisplay('block');
    this.imageLoaderConfig.setFallbackUrl('assets/Sweet_Donuts_images/Home/placeholder.jpg');
    this.imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024); // set max size to 20MB
    this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000); // 7 days
    this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
    this.imageLoaderConfig.setConcurrency(10);
    this.imageLoaderConfig.useImageTag(true);
  }
}

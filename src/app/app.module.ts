import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { OneSignal } from '@ionic-native/onesignal';
import { BundlesAssortedPage } from '../pages/bundles-assorted/bundles-assorted';
import { AllCategoriesPage } from '../pages/all-categories/all-categories';
import { MyCartPage } from '../pages/my-cart/my-cart';
import { CheckoutPage } from '../pages/checkout/checkout';
import { CategoryDetailPage } from '../pages/category-detail/category-detail';
import { MyAddressesPage } from '../pages/my-addresses/my-addresses';
import { AddRemovePopoverPage } from '../pages/add-remove-popover/add-remove-popover';
import { OrderHistoryPage } from '../pages/order-history/order-history';
import { ReOrderDetailsPage } from '../pages/re-order-details/re-order-details';
import { OurLocationPage } from '../pages/our-location/our-location';
import { MyFavouritesPage } from '../pages/my-favourites/my-favourites';
import { SignupPage } from '../pages/signup/signup';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServicesProvider } from '../providers/services/services';
import { LoginPage } from '../pages/login/login';
import { ProductWizardPage } from '../pages/product-wizard/product-wizard';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { AccountVerificationPage } from '../pages/account-verification/account-verification';
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';
import { ProductDetailsPage } from '../pages/product-details/product-details';
import { AddAddressPage } from '../pages/modal/add-address/add-address';
import { GlobalStringsProvider } from '../providers/global-strings/global-strings';
import { OrderReviewPage } from '../pages/order-review/order-review';
import { OrderThankyouPage } from '../pages/order-thankyou/order-thankyou';
import { ValidationService } from '../providers/services/validation-service';
import { ionicComponents } from '../providers/ionic-components/ionic-components';
import { Connectivity } from '../providers/connectivity-service/connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';
import { StoreInfoModalPage } from '../pages/store-info-modal/store-info-modal';
import { AccountSettingsPage } from '../pages/account-settings/account-settings';
import { ComboDetailsPage } from '../pages/combo-details/combo-details';
import { PhoneVerificationPage } from '../pages/phone-verification/phone-verification';
import { MainProvider } from '../providers/main/main';
import { AddAdressPage } from '../pages/add-adress/add-adress';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { AccountCreatedThankuModalPage } from '../pages/modal/account-created-thanku-modal/account-created-thanku-modal';
import { ForgotPasswordLinkMessagePage } from '../pages/modal/forgot-password-link-message/forgot-password-link-message';
import { StoreInfoPage } from '../pages/modal/store-info/store-info';
import { Keyboard } from '@ionic-native/keyboard';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AddToCartModalPage } from '../pages/modal/add-to-cart-modal/add-to-cart-modal';
import { RateUsPage } from '../pages/modal/rate-us/rate-us';
import { FoodFeedbackPage } from '../pages/modal/food-feedback/food-feedback';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { PaymentInfoPage } from '../pages/payment-info/payment-info';
import { StoreTimingsPage } from '../pages/store-timings/store-timings';
import { ReOrderConfirmModalPage } from '../pages/re-order-confirm-modal/re-order-confirm-modal';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import { IonicImageLoader } from 'ionic-image-loader';


@NgModule({
  declarations: [
    MyApp,
    // HomePage,
    // StoreTimingsPage,
    // StoreInfoPage,
    // BundlesAssortedPage,
    // ComboDetailsPage,
    // StoreInfoModalPage,
    // AllCategoriesPage,
    // ProductWizardPage,
    // CategoryDetailPage,
    // ProductDetailsPage,
    // AddToCartModalPage,
    // MyCartPage,
    // CheckoutPage,
    // OrderReviewPage,
    // OrderThankyouPage,
    // RateUsPage,
    // FoodFeedbackPage,
    // AddAddressPage,
    // MyAddressesPage,
    // AddRemovePopoverPage,
    // OrderHistoryPage,
    // ReOrderDetailsPage,
    // ReOrderConfirmModalPage,
    // OurLocationPage,
    // MyFavouritesPage,
    // AccountSettingsPage,
    // ChangePasswordPage,
    // LoginPage,
    // SignupPage,
    // PhoneVerificationPage,
    // ForgotPasswordPage,
    // AccountVerificationPage,
    // AccountCreatedThankuModalPage,
    // ForgotPasswordLinkMessagePage,
    // AddAdressPage,
    // ContactUsPage,
    // PaymentInfoPage
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false }),
    IonicImageLoader.forRoot(),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    StoreTimingsPage,
    StoreInfoPage,
    BundlesAssortedPage,
    ComboDetailsPage,
    StoreInfoModalPage,
    AllCategoriesPage,
    ProductWizardPage,
    CategoryDetailPage,
    ProductDetailsPage,
    AddToCartModalPage,
    MyCartPage,
    CheckoutPage,
    OrderReviewPage,
    OrderThankyouPage,
    RateUsPage,
    FoodFeedbackPage,
    AddAddressPage,
    AddRemovePopoverPage,
    MyAddressesPage,
    AddRemovePopoverPage,
    OrderHistoryPage,
    ReOrderDetailsPage,
    ReOrderConfirmModalPage,
    OurLocationPage,
    MyFavouritesPage,
    AccountSettingsPage,
    ChangePasswordPage,
    LoginPage,
    SignupPage,
    PhoneVerificationPage,
    ForgotPasswordPage,
    AccountVerificationPage,
    AccountCreatedThankuModalPage,
    ForgotPasswordLinkMessagePage,
    AddAdressPage,
    ContactUsPage,
    PaymentInfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ValidationService,
    ionicComponents,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServicesProvider,
    Network,
    NetworkProvider,
    GlobalStringsProvider,
    Connectivity,
    Geolocation,
    MainProvider,
    Keyboard,
    OneSignal,
    Diagnostic,
    InAppBrowser,
    GoogleAnalytics,
    AppVersion,
    Market,
    Validators

  ]
})
export class AppModule { }

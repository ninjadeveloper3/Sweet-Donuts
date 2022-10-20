import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders,} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map, catchError} from 'rxjs/operators';

/*
  Generated class for the ServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicesProvider {
  sellerId: number = 213;
  public apiUrl = 'https://www.Sweetdonuts.pk/Services/Services/EService.svc'; // DD live server (DB)
  public imagesURL = 'https://www.Sweetdonuts.pk/nimda/'; // DD images live server (client)
  public feedbacApi = 'http://nps.iblgrp.com/api/add_feedback_reponse';
  public feedbackApiKey = 'NWdHUGFsUzE1Vzg1Qml1dTRvOXRhVUd1b213dEJrRkZ4YlJaN2g1dGdycDB0UjcxUXNBdjZOZHR5a0Vn5b6c605238387';
  headers: HttpHeaders;

  constructor(public http: HttpClient) {
    console.log('Hello ServicesProvider Provider');
    let headerJson = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': this.feedbackApiKey
    }
    this.headers = new HttpHeaders(headerJson);
  }

  // *************Extract response body and Errors************
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  Save_header(token) {
    console.log("saving header")
    this.headers.set('X-API-KEY', token);
    console.log(this.headers);
  }

  Get_header() {
    return this.headers;
  }

  // ***********************API functions***********************
  // ***********************login*******************************
  login(data) {
    console.log(this.apiUrl + '/LogIn');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/LogIn', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

  }

  // ***********************signup*******************************
  doSignUp(data) {
    console.log(this.apiUrl + '/SignUp');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/SignUp', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Code Verification*********************
  CodeVerification(data) {
    console.log(this.apiUrl + '/ConfirmationCode');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/ConfirmationCode', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Re-Send Code*********************
  ReSendCode(data) {
    console.log(this.apiUrl + '/ResendCode');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/ResendCode', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Forgot Password*********************
  forgotPassword(data) {
    console.log(this.apiUrl + '/ForgotPassword');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/ForgotPassword', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Forgot Password*********************
  doResetPassword(data) {
    console.log(this.apiUrl + '/ChangePassword');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/ChangePassword', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************stores*******************************
  doGetAllstores() {
    return this.http.get(this.apiUrl + '/StoresBySellerID/' + this.sellerId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  doGetNearestStores(data) {
    return this.http.post(this.apiUrl + '/NearestStores', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  doGetStoresByLocation(lat, long) {
    console.log(this.apiUrl + '/GetStoreByLatLong/' + this.sellerId + '/' + lat + '/' + long);
    return this.http.get(this.apiUrl + '/GetStoreByLatLong/' + this.sellerId + '/' + lat + '/' + long).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Banners by Store*************************
  doGetBannerImages(storeId) {
    console.log(this.apiUrl + '/GetAllDealsByStoreID/' + storeId);
    return this.http.get(this.apiUrl + '/GetAllDealsByStoreID/' + storeId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Combo Deal by Id*************************
  doGetDealById(deal_id, storeId) {
    console.log(this.apiUrl + '/GetDealItemsById/' + deal_id + '/' + storeId);
    return this.http.get(this.apiUrl + '/GetDealItemsById/' + deal_id + '/' + storeId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Catagories*******************************
  CategoriesBySellerAndStoreID(storeId) {
    console.log(this.apiUrl + '/GetCategoriesBySellerAndStoreID');
    console.log(JSON.stringify(storeId));
    return this.http.get(this.apiUrl + '/GetCategoriesBySellerAndStoreID/' + this.sellerId + '/' + storeId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Catagories products*******************************
  Catagoriesproduct(data) {
    console.log("url", this.apiUrl + '/GetCategoriesBySellerAndStoreID');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/ProductsBySellerStoreAndCategoryIDs', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Catagories products by id*******************************
  Catagoriesproductid(store_id, data, userId) {
    console.log("api url", this.apiUrl + '/GetCategoryItemsById/' + store_id + '/' + data + '/' + userId);

    return this.http.get(this.apiUrl + '/GetCategoryItemsById/' + store_id + '/' + data + '/' + userId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************combo products by id*******************************
  comboproductid(data, id) {
    console.log("api url", this.apiUrl + '/GetDealsByParentID/' + data + '/' + id);
    return this.http.get(this.apiUrl + '/GetDealsByParentID/' + data + '/' + id).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************combo detail products by id*******************************
  combodetailproductid(data, storeId) {
    console.log("api url", this.apiUrl + '/GetDealItemsById/' + data + '/' + storeId);
    return this.http.get(this.apiUrl + '/GetDealItemsById/' + data + '/' + storeId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Promo Code*******************************
  PromoCode(data) {
    console.log("url", this.apiUrl + '/GetPromoCode');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/GetPromoCode', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Favourites*******************************

  AddToFavourites(data) {
    console.log("url", this.apiUrl + '/AddToFavourite');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/AddToFavourite', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  RemoveFavourite(data) {
    console.log("url", this.apiUrl + '/RemoveFavourite');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/RemoveFavourite', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  GetFavouriteProducts(data) {
    console.log("url", this.apiUrl + '/GetFavouriteProducts');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/GetFavouriteProducts', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getProductDetails(pId, storeId) {
    console.log("api url", this.apiUrl + '/GetProductByID/' + pId + '/' + storeId + '/' + 'null');
    return this.http.get(this.apiUrl + '/GetProductByID/' + pId + '/' + storeId + '/' + 'null').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************All Addresses*******************************
  AllAddressByUserId(data) {
    return this.http.get(this.apiUrl + '/CustomerAddresses/' + data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Add Addresses*******************************
  Addaddress(data) {
    console.log(this.apiUrl + '/AddCutomerShippingAddress');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/AddCutomerShippingAddress', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Update Addresses*******************************
  updateAddress(data) {
    console.log(this.apiUrl + '/UpdateCutomerShippingAddressByCustAndAddID');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/UpdateCutomerShippingAddressByCustAndAddID', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Delete Addresses*******************************
  deleteAddressByCustomerId(data) {
    console.log(this.apiUrl + '/DeleteShippingAddressByID');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/DeleteShippingAddressByID', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************update Profile*******************************
  updateProfile(data) {
    console.log(this.apiUrl + '/UpdateCustomerProfile');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/UpdateCustomerProfile', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Change Password*******************************
  changePassword(data) {
    console.log(this.apiUrl + '/UpdatePassword');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/UpdatePassword', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************contact Feedback *******************************
  contactfeedbackdata(data) {
    console.log(this.apiUrl + '/SendCustomerFeedBack');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/SendCustomerFeedBack', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************All Countries*******************************
  doGetAllCountries() {
    return this.http.get(this.apiUrl + '/AllCountries').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************All Ingredients*******************************
  doGetAllIngredients() {
    return this.http.get(this.apiUrl + '/PizzaIngredientsBySellerID/' + this.sellerId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ***********************Store Info*******************************
  GetStoreInfo(StoreId) {
    console.log("api url", this.apiUrl + '/GetStoreByID/' + StoreId);
    return this.http.get(this.apiUrl + '/GetStoreByID/' + StoreId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ******************User Addresses on Checkout**************************

  doGetCustomerAddresses(userId) {
    return this.http.get(this.apiUrl + '/CustomerAddresses/' + userId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ******************User Addresses on Checkout**************************
  StoreFeedback(data) {
    console.log(this.apiUrl + '/SendCustomerFeedBack');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/SendCustomerFeedBack', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ******************Place Order**************************
  doPlaceOrder(data) {
    console.log(this.apiUrl + '/DDCheckOut');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/DDCheckOut', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ******************Order History**************************
  doGetOrderHistory(userId) {
    console.log(this.apiUrl + '/CustomerOrdersBySellerAndCustomerIDs/' + this.sellerId + '/' + userId)
    return this.http.get(this.apiUrl + '/CustomerOrdersBySellerAndCustomerIDs/' + this.sellerId + '/' + userId).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ******************Brand Feedback**************************
  deSendBrandFeedback(data) {
    console.log(this.feedbacApi);
    console.log(JSON.stringify(data));
    let modal = this.feedbacApi + '?email=' + data.email + '&rating=' + data.rating + '&remarks=' + data.remarks + '&channel=' + data.channel + '&phone=' + data.phone;
    return this.http.post(modal, data, {headers: this.headers}).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // ******************Order Rating**************************
  orderRating(data) {
    console.log(this.apiUrl + '/OrderReview');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/OrderReview', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  // *********************logout**************************
  logout(data) {
    console.log(this.apiUrl + '/SignOut');
    console.log(JSON.stringify(data));
    return this.http.post(this.apiUrl + '/SignOut', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  setAppVersion(versionCode) {
    console.log(this.apiUrl + '/VerionSet');
    console.log(JSON.stringify(versionCode));
    return this.http.get(this.apiUrl + '/VerionSet/' + versionCode).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }


  getAppVersion() {
    return this.http.get(this.apiUrl + '/VersionCheck').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
} 

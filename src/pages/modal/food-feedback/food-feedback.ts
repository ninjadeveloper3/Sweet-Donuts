import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {HomePage} from '../../home/home';
import {MainProvider} from '../../../providers/main/main';
import {ionicComponents} from '../../../providers/ionic-components/ionic-components';
import {ServicesProvider} from '../../../providers/services/services';
import {OrderHistoryPage} from '../../order-history/order-history';

/**
 * Generated class for the FoodFeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-food-feedback',
  templateUrl: 'food-feedback.html',
})
export class FoodFeedbackPage {
  feedback: number[];
  selected: number = 0;
  remarks: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public main: MainProvider, public ionicComponent: ionicComponents, public rest: ServicesProvider) {
    this.feedback = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodFeedbackPage');
  }

  select(item, nextElement) {
    this.selected = item;
    console.log("selected range", item);
  };

  isActive(item) {
    return this.selected === item;
  }

  submit() {
    debugger
    if (this.selected == 0) {
      this.ionicComponent.ShowToast("Please select rating before submit!");
    }
    else {
      let user = this.main.getItems('userObject');
      let phone = user.CellNumber.substr(1);
      let data = {
        email: user.EmailAddress,
        rating: this.selected,
        remarks: this.remarks,
        channel: 'DD_MOBILE_APP',
        phone: phone
      }
      if (this.main.isConnected()) {
        this.ionicComponent.ShowLoader();
        this.rest.deSendBrandFeedback(data)
          .subscribe(data => {
            console.log(data)
            if (data.status === 0) {
              console.log(data);
              this.ionicComponent.hideLoader();
              this.ionicComponent.ShowToast("Feedback submitted successfully!");
              this.navCtrl.pop();
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

  }

  submitFeedback() {
  }

  ionViewWillLeave() {
    this.main.StoreSessionStorage('notification', false);
    this.main.StoreSessionStorage('notificationOpened', null);
  }

}

import {Injectable} from '@angular/core';
import {ToastController, Toast, LoadingController, AlertController, Events} from 'ionic-angular';
import {MyApp} from '../../app/app.component';

@Injectable()
export class ionicComponents {

  toast: Toast = null;
  loader: any;

  constructor(private toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public events: Events) {
    this.events.subscribe('hideLoaderEvent', () => {
      this.showToast("no internet");
      this.hideLoader();
    });
  }

  ShowToast(text: string): void {
    let toastData = {
      message: text,
      duration: 3000,
      position: 'bottom'
    }

    this.showToast(toastData);
  }

  private showToast(data: any): void {
    this.toast ? this.toast.dismiss() : false;
    this.toast = this.toastCtrl.create(data);
    this.toast.present();
  }

  ShowLoader(): void {

    this.loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <img src="assets/Sweet_Donuts_images/Home/loader@2x.gif">`,
    });
    this.loader.present();

  }

  hideLoader(): void {
    this.loader.dismiss();
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  ConfirmAlert(title, message, btntxt) {
    debugger
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: btntxt,
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        }, {
          text: 'Cancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }
      ]
    });

    return alert;

  }
}

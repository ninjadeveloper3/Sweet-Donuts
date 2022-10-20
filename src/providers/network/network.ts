import { HttpClient  } from '@angular/common/http';
import { AlertController, Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export enum ConnectionStatusEnum {
  Online,
  Offline
}
@Injectable()
export class NetworkProvider {
  previousStatus: ConnectionStatusEnum;

  constructor(public http: HttpClient,
              public alertCtrl: AlertController,
              public network: Network,
              public eventCtrl: Events) {
    console.log('Hello NetworkProvider Provider');
    this.previousStatus = ConnectionStatusEnum.Online;
  }

}

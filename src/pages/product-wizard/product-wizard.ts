import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Slides, ViewController } from 'ionic-angular';

/**
 * Generated class for the ProductWizardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-wizard',
  templateUrl: 'product-wizard.html',
})
export class ProductWizardPage {
  @ViewChild(Slides) slides: Slides;
  myParam: string;
  lastslide:any;
  val:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public  alertCtrl: AlertController,public viewCtrl: ViewController) {
    this.myParam = this.navParams.get('myParam');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductWizardPage');
  }
  next() {
  this.lastslide = this.slides.isEnd();
  if(this.lastslide==false) {

    this.slides.slideNext();
  }
  else
  {
    // this.val =  this.lastslide;
    this.dismiss();
  }
 }
 prev() {
   this.slides.slidePrev();
   this.val =  'false';
 }
 dismiss() {
  this.viewCtrl.dismiss();
}
}

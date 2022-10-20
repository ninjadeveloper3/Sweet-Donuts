import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddToCartModalPage } from './add-to-cart-modal';

@NgModule({
  declarations: [
    AddToCartModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddToCartModalPage),
  ],
})
export class AddToCartModalPageModule {}

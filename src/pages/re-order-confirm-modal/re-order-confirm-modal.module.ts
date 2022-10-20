import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReOrderConfirmModalPage } from './re-order-confirm-modal';

@NgModule({
  declarations: [
    ReOrderConfirmModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ReOrderConfirmModalPage),
  ],
})
export class ReOrderConfirmModalPageModule {}

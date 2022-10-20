import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreInfoModalPage } from './store-info-modal';

@NgModule({
  declarations: [
    StoreInfoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(StoreInfoModalPage),
  ],
})
export class StoreInfoModalPageModule {}

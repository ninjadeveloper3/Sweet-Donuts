import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreInfoPage } from './store-info';

@NgModule({
  declarations: [
    StoreInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(StoreInfoPage),
  ],
})
export class StoreInfoPageModule {}

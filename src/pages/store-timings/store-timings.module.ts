import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreTimingsPage } from './store-timings';

@NgModule({
  declarations: [
    StoreTimingsPage,
  ],
  imports: [
    IonicPageModule.forChild(StoreTimingsPage),
  ],
})
export class StoreTimingsPageModule {}

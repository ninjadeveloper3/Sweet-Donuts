import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReOrderDetailsPage } from './re-order-details';

@NgModule({
  declarations: [
    ReOrderDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReOrderDetailsPage),
  ],
})
export class ReOrderDetailsPageModule {}

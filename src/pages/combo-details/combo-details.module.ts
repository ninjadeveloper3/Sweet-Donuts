import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComboDetailsPage } from './combo-details';

@NgModule({
  declarations: [
    ComboDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ComboDetailsPage),
  ],
})
export class ComboDetailsPageModule {}

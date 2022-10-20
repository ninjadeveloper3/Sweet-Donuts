import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAdressPage } from './add-adress';

@NgModule({
  declarations: [
    AddAdressPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAdressPage),
  ],
})
export class AddAdressPageModule {}

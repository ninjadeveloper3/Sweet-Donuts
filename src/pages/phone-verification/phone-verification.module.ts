import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhoneVerificationPage } from './phone-verification';

@NgModule({
  declarations: [
    PhoneVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(PhoneVerificationPage),
  ],
})
export class PhoneVerificationPageModule {}

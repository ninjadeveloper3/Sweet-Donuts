import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OurLocationPage } from './our-location';

@NgModule({
  declarations: [
    OurLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(OurLocationPage),
  ],
})
export class OurLocationPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {SharedModule} from "../../app/shared.module";
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages';

@NgModule({
  declarations: [
    HomePage,
    // ControlMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),SharedModule
  ],
  exports: [
    // ControlMessagesComponent
  ]
})
export class LoginPageModule { }

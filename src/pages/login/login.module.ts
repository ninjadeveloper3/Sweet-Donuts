import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages';

@NgModule({
  declarations: [
    LoginPage,
    // ControlMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
  exports: [
    // ControlMessagesComponent
  ]
})
export class LoginPageModule {}

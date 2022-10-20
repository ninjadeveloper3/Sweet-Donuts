import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddRemovePopoverPage } from './add-remove-popover';

@NgModule({
  declarations: [
    AddRemovePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(AddRemovePopoverPage),
  ],
})
export class AddRemovePopoverPageModule {}

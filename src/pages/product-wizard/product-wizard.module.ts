import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductWizardPage } from './product-wizard';

@NgModule({
  declarations: [
    ProductWizardPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductWizardPage),
  ],
})
export class ProductWizardPageModule {}

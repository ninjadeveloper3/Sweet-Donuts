import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductDetailsPage } from './product-details';
import {SharedModule} from "../../app/shared.module";

@NgModule({
  declarations: [
    ProductDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductDetailsPage),SharedModule
  ]
})
export class ProductDetailsPageModule {}

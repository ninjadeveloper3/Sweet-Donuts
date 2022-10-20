import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllCategoriesPage } from './all-categories';
import {SharedModule} from "../../app/shared.module";

@NgModule({
  declarations: [
    AllCategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllCategoriesPage),SharedModule]
})
export class AllCategoriesPageModule {}

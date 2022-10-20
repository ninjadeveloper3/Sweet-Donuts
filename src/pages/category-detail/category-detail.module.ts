import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryDetailPage } from './category-detail';
import {SharedModule} from "../../app/shared.module";

@NgModule({
  declarations: [
    CategoryDetailPage,
  ],
  imports: [
    
    IonicPageModule.forChild(CategoryDetailPage),SharedModule]
  
})
export class CategoryDetailPageModule {}

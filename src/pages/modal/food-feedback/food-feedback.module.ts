import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodFeedbackPage } from './food-feedback';

@NgModule({
  declarations: [
    FoodFeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodFeedbackPage),
  ],
})
export class FoodFeedbackPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TakeoutlistPage } from './takeoutlist';

@NgModule({
  declarations: [
    TakeoutlistPage,
  ],
  imports: [
    IonicPageModule.forChild(TakeoutlistPage),
  ],
})
export class TakeoutlistPageModule {}

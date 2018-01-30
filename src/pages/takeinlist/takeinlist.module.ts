import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TakeinlistPage } from './takeinlist';

@NgModule({
  declarations: [
    TakeinlistPage,
  ],
  imports: [
    IonicPageModule.forChild(TakeinlistPage),
  ],
})
export class TakeinlistPageModule {}

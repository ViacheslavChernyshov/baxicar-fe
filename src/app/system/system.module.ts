import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SystemRoutingModule} from './system-routing.module';
import {PassengerPageComponent} from './passenger-page/passenger-page.component';
import {DriverPageComponent} from './driver-page/driver-page.component';
import {SystemComponent} from './system.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    PassengerPageComponent,
    DriverPageComponent,
    // TaxiDriverPageComponent,
    // TaxiPassengerPageComponent,
    SystemComponent
  ]
})
export class SystemModule {

}

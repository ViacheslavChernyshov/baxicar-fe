import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SystemRoutingModule} from './system-routing.module';
import {PassengerPageComponent} from './passenger-page/passenger-page.component';
import {DriverPageComponent} from './driver-page/driver-page.component';
import {TaxiDriverPageComponent} from './taxidriver-page/taxi-driver-page.component';
import {TaxiPassengerPageComponent} from './taxipassenger-page/taxi-passenger-page.component';
import {SystemComponent} from './system.component';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule
  ],
  declarations: [
    PassengerPageComponent,
    DriverPageComponent,
    TaxiDriverPageComponent,
    TaxiPassengerPageComponent,
    SystemComponent
  ]
})
export class SystemModule {

}

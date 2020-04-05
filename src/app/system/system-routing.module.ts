import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SystemComponent} from './system.component';
import {DriverPageComponent} from './driver-page/driver-page.component';
import {PassengerPageComponent} from './passenger-page/passenger-page.component';

const routes: Routes = [
  {
    path: 'system', component: SystemComponent, children: [
      {path: 'driver', component: DriverPageComponent},
      {path: 'passenger', component: PassengerPageComponent}
      // ,
      // {path: 'taxidriver', component: TaxiDriverPageComponent},
      // {path: 'taxipassenger', component: TaxiPassengerPageComponent}

    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {

}

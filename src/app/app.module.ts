import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AddUserComponent} from './add-user/add-user.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import {ListUserComponent} from './list-user/list-user.component';
import {ApiService} from './core/api.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routing} from './app.routing';
import {SystemModule} from './system/system.module';

// import {AgmCoreModule} from 'angular2-google-maps/core';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddUserComponent,
    EditUserComponent,
    ListUserComponent
  ],
  imports: [
    BrowserModule,
    routing,
    ReactiveFormsModule,
    HttpClientModule,
    SystemModule,
    FormsModule
    // ,    AgmCoreModule.forRoot({apiKey: 'AIzaSyAmjI8t-x5OZdt1JbGA76oyGWyCIqI42KA'})
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

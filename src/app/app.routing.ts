import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AddUserComponent} from './add-user/add-user.component';
import {ListUserComponent} from './list-user/list-user.component';
import {EditUserComponent} from './edit-user/edit-user.component';
// zaza
import {SystemComponent} from './system/system.component';
// zaza

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'add-user', component: AddUserComponent},
  {path: 'list-user', component: ListUserComponent},
  {path: 'edit-user', component: EditUserComponent},
  {path: 'system', component: SystemComponent},
  {path: '', component: LoginComponent}
];

export const routing = RouterModule.forRoot(routes);

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [{
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        redirectTo:'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component:LoginComponent,
        pathMatch: 'full',
      },
  
    ],
  }];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class AccountRoutingModule {
  }
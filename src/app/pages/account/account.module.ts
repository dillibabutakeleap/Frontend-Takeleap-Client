import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ThemeModule } from 'app/@theme/theme.module';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { FormsModule } from '@angular/forms';
//import { AccountService } from './account.service';

@NgModule({
  declarations: [LoginComponent,AccountComponent],
  imports: [
    CommonModule,
    ThemeModule,
    AccountRoutingModule,
    FormsModule,
  ],
  exports:[LoginComponent,AccountComponent],
  //providers:[AccountService]
})
export class AccountModule { }

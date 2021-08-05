import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private router:Router,private thisUser:User){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean>{
      return this.thisUser.currentUser
      .pipe(
        take(1),
        map((isLoggedIn: User)=>{
          //console.log(isLoggedIn);
          if (isLoggedIn == null){
            this.router.navigate(['/login'],{replaceUrl:true});  // {4}
            return false;
          }
          return true;
        }
      )
      )
      //this.router.navigateByUrl('');
      
  }
  
}

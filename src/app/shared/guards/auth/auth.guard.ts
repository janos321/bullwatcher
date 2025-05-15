import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isLoggedIn } from '../../../pages/login/login.component'

export const authGuard: CanActivateFn = (route, state) => {
  const router=inject(Router)
  if(!isLoggedIn()){
    router.navigate(['/home']);
  }
  return isLoggedIn();
};

export const logInGuard: CanActivateFn = (route, state) => {
  const router=inject(Router)
  if(isLoggedIn()){
    router.navigate(['/home']);
  }
  return !isLoggedIn();
};

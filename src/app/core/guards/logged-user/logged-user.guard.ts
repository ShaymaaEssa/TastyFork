import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { userToken } from '../../environment/environment';

export const loggedUserGuard: CanActivateFn = (route, state) => {
  const id = inject(PLATFORM_ID);
  const router = inject(Router);

  if(isPlatformBrowser(id)){
  
    if(localStorage.getItem(userToken.token) === null){
      return true;
    } else{
      router.navigate(['\home']);
      return false;

    }
  } else {
    return false;
  }
};
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { userToken } from '../../environment/environment';

export const authUserGuard: CanActivateFn = (route, state) => {
  const id = inject(PLATFORM_ID);
  const router = inject(Router);

  if(isPlatformBrowser(id)){
  
    if(localStorage.getItem(userToken.token) === null){
      router.navigate(['\signin']);
      return false;
    } else{
      return true;
    }
  } else {
    return false;
  }
};
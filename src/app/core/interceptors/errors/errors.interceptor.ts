import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((err)=>{
    console.log(err.message.error);
    alert(`Error: ${err.message.error}`)
    return throwError(()=>err)
  }));
};

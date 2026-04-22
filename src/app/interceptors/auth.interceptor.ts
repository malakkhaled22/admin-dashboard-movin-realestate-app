import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('INTERCEPTOR CALLED');

  const token = localStorage.getItem('token');
  console.log('TOKEN:', token);

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${token}`
      )
    });
    return next(authReq);
  }

  return next(req);
};

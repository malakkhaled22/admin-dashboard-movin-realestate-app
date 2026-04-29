import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const accessToken = localStorage.getItem('accessToken');

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {

          return http.post<any>('https://movin-backend-production.up.railway.app/api/auth/refresh-token', { refreshToken })
            .pipe(
              switchMap((res) => {
                localStorage.setItem('accessToken', res.accessToken);

                const newAuthReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` }
                });
                return next(newAuthReq);
              }),
              catchError((refreshErr) => {
                
                localStorage.clear();
                window.location.href = '/login';
                return throwError(() => refreshErr);
              })
            );
        }
      }
      return throwError(() => error);
    })
  );
};

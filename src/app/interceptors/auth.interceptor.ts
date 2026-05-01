import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

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
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403) && !req.url.includes('refresh-token')) {

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            return http.post<any>('https://movin-backend-production.up.railway.app/api/auth/refresh-token', { refreshToken })
              .pipe(
                switchMap((res) => {
                    isRefreshing = false;

                    const newAccToken = res.accessToken?.accessToken || res.accessToken || res.token;
                    const newRefToken = res.accessToken?.refreshToken || res.refreshToken;

                    if (newAccToken) {
                        localStorage.setItem('accessToken', newAccToken);

                        if (newRefToken) {
                            localStorage.setItem('refreshToken', newRefToken);
                        }

                        refreshTokenSubject.next(newAccToken);

                        return next(req.clone({
                            setHeaders: { Authorization: `Bearer ${newAccToken}` }
                        }));
                    } else {
                        throw new Error('Token structure mismatch');
                    }
                }),
                catchError((refreshErr) => {
                  isRefreshing = false;
                  localStorage.clear();
                  window.location.href = '/login';
                  return throwError(() => refreshErr);
                })
              );
          }
        } else {
          return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
              return next(req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              }));
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};

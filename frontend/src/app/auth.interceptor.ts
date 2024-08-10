import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = 'jbYGSeWZsYRkBpuqjDPfyyjM5KNh2e1H';

    // Check conditions to decide which header to set
    if (req.url.includes('api/find-races') || req.url.includes('api/search-races') || req.url.includes('api/featured-race')) {
      // Set API key header
      const authReq = req.clone({
        setHeaders: {
          'X-API-Key': apiKey,
        },
      });
      console.log('authReq:', authReq);
      return next.handle(authReq);
    } else {
      // Set Authorization header with token
      let authReq = req;
      const authToken = this.authService.getAuthToken();

      if (authToken) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      // Intercept the request and handle potential errors
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.log('Token expired, refreshing token...');
            return this.authService.refreshToken().pipe(
              switchMap((response: any) => {
                const newToken = response.access;
                this.authService.setAuthToken(newToken);

                const newAuthReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                });
                return next.handle(newAuthReq);
              }),
              catchError((err) => {
                console.log('Token refresh failed, logging out...', err);
                this.authService.logout();
                return throwError(err);
              })
            );
          }
          console.error('Request error:', error);
          return throwError(error);
        })
      );
    }
  }
}


  /*intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken = this.authService.getAuthToken();
    console.log('Intercepting request, initial authToken:', authToken);

    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log('Auth token added to headers:', authToken);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Token expired, refreshing token...');
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              const newToken = response.access_token;
              this.authService.setAuthToken(newToken);

              const newAuthReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(newAuthReq);
            }),
            catchError((err) => {
              console.log('Token refresh failed, logging out...', err);
              this.authService.logout();
              return throwError(err);
            })
          );
        }
        console.error('Request error:', error);
        return throwError(error);
      })
    );
  }
} */

  /*intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken = this.authService.getAuthToken();

    if (!authToken) {
      authToken = this.authService.getCookie('authToken');
    }

    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('Auth token added to headers:', authToken);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Token expired, refreshing token...');
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              const newToken = response.access;
              this.authService.setAuthToken(newToken);
              const newAuthReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next.handle(newAuthReq);
            }),
            catchError((err) => {
              console.log('Token refresh failed, logging out...', err);
              this.authService.logout();
              return throwError(err);
            })
          );
        }
        console.error('Request error:', error);
        return throwError(error);
      })
    );
  }
}




@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {} 

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken = this.authService.getAuthToken();
    
    if (!authToken) {
      authToken = this.authService.getCookie('authToken');
    }

    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.endsWith('/token/refresh/')) {
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              const newToken = response.access;
              this.authService.setAuthToken(newToken);
              const newAuthReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(newAuthReq);
            }),
            catchError((err) => {
              this.authService.logout();
              return throwError(err);
            })
          );
        }
        return throwError(error);
      })
    );
  }

} 
    
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Token expired, refreshing token...');
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              const newToken = response.access;
              this.authService.setAuthToken(newToken);

              const newAuthReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(newAuthReq);
            }),
            catchError((err) => {
              console.log('Token refresh failed, logging out...', err);
              this.authService.logout();
              return throwError(err);
            })
          );
        }
        console.error('Request error:', error);
        return throwError(error);
      })
    );
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
} 


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {} 

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting request:', req.url); // Log the URL
    const authToken = this.authService.getAuthToken();

    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log('Auth token added to headers:', authToken);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Token expired, refreshing token...');
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              const newToken = response.access;
              this.authService.setAuthToken(newToken);

              const newAuthReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(newAuthReq);
            }),
            catchError((err) => {
              console.log('Token refresh failed, logging out...', err);
              this.authService.logout();
              return throwError(err);
            })
          );
        }
        console.error('Request error:', error);
        return throwError(error);
      })
    );
  } 
} */




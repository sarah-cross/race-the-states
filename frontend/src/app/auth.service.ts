import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/auth/';
  private authTokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    //@Inject(PLATFORM_ID) private platformId: Object
  ) {}

  register(username: string, email: string, password1: string, password2: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers: headers };

    return this.http.post<any>(`${this.baseUrl}register/`, { username, email, password1, password2 }, options).pipe(
      tap((response) => {
        console.log('User registered successfully:', response);
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(error);
      })
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}login/`, { username, password }).pipe(
      tap(response => {
        if (response && response.access_token && response.refresh_token) {
          this.setAuthToken(response.access_token);
          this.setRefreshToken(response.refresh_token);
        }
      })
    );
  }

  setAuthToken(token: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.authTokenKey, token);
    }
    this.setCookie(this.authTokenKey, token);
  }

  setRefreshToken(token: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.refreshTokenKey, token);
    }
    this.setCookie(this.refreshTokenKey, token);
  }

  getAuthToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.authTokenKey) || this.getCookie(this.authTokenKey);
    } else {
      return this.getCookie(this.authTokenKey);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.refreshTokenKey) || this.getCookie(this.refreshTokenKey);
    } else {
      return this.getCookie(this.refreshTokenKey);
    }
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    console.log('refresh token:', refreshToken);
    return this.http.post<any>(`${this.baseUrl}token/refresh/`, { refresh: refreshToken }).pipe(
      tap(response => {
        if (response && response.access) {
          this.setAuthToken(response.access);
        }
      }),
      catchError(error => {
        console.error('Refresh token error:', error);
        return throwError(error);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(this.authTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
    this.deleteCookie(this.authTokenKey);
    this.deleteCookie(this.refreshTokenKey);
    this.router.navigate(['/login']);
  }

  setCookie(name: string, value: string, days: number = 1): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name: string): void {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

  /*register(username: string, email: string, password1: string, password2: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers: headers };

    return this.http.post<any>(`${this.baseUrl}register/`, { username, email, password1, password2 }, options).pipe(
      tap((response) => {
        console.log('User registered successfully:', response);
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(error);
      })
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}login/`, { username, password }).pipe(
      tap(response => {
        if (response && response.access_token && response.refresh_token) {
          this.setAuthToken(response.access_token);
          this.setRefreshToken(response.refresh_token);
        }
      })
    );
  }

  setAuthToken(token: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.authTokenKey, token);
    }
    this.setCookie(this.authTokenKey, token);
  }

  setRefreshToken(token: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.refreshTokenKey, token);
    }
    this.setCookie(this.refreshTokenKey, token);
  }

  getAuthToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.authTokenKey) || this.getCookie(this.authTokenKey);
    } else {
      return this.getCookie(this.authTokenKey);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.refreshTokenKey) || this.getCookie(this.refreshTokenKey);
    } else {
      return this.getCookie(this.refreshTokenKey);
    }
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    console.log('refresh token:', refreshToken);
    return this.http.post<any>(`${this.baseUrl}token/refresh/`, { refresh_token: refreshToken }).pipe(
      tap(response => {
        if (response && response.access_token) {
          this.setAuthToken(response.access_token);
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(this.authTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
    this.deleteCookie(this.authTokenKey);
    this.deleteCookie(this.refreshTokenKey);
  }

  setCookie(name: string, value: string): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 1 day
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=-99999999;`;
  }

} */
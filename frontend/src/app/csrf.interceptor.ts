// csrfInterceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrfToken = this.getCSRFToken();

    if (csrfToken) {
      const cloned = req.clone({
        headers: req.headers.set('X-CSRFToken', csrfToken)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }

  private getCSRFToken(): string {
    if (typeof document === 'undefined') {
      // document is not available (e.g., server-side rendering)
      return '';
    }

    const csrfCookie = this.getCookie('csrftoken');
    return csrfCookie ? csrfCookie : '';
  }

  private getCookie(name: string): string {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop()! : '';
  }
}

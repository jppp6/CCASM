import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (this.authService.isLoggedIn) {
            const modifiedRequest = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + localStorage['Bearer Token'],
                },
            });
            return next.handle(modifiedRequest);
        }
        return next.handle(request);
    }
}

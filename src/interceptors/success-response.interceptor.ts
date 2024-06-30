import {
  CallHandler,
  Catch,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

@Catch()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('ets');
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
      catchError((err) => throwError(() => err)),
    );
  }
}

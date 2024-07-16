import { ExecutionContext, HttpServer } from '@nestjs/common';

export function setGlobalValue(value: any, context: ExecutionContext) {
  const httpContext = context.switchToHttp();
  const request = httpContext.getRequest();
  request.app.set('globalValue', value);
}

export function getGlobalValue(context: ExecutionContext) {
  const httpContext = context.switchToHttp();
  const request = httpContext.getRequest();
  return request.app.get('globalValue');
}

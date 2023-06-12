import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(Request: Request, Response: Response, next: NextFunction) {
    console.log(`UseIdCheckMiddleware`, 'antes');
    if (isNaN(Number(Request.params.id)) || Number(Request.params.id) <= 0) {
      throw new BadRequestException('id inválido!');
    }
    console.log(`UseIdCheckMiddleware`, 'Depois');
    next();
  }
}

import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth'; // Importa sua config
@Controller('api/auth')
export class AuthController {
  @All('*')
  async handle(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(auth)(req, res);
  }
} 
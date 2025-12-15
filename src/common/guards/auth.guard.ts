import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { db } from '../../db'; // Importando do seu index.ts
import * as schema from '../../drizzle/schema'; // Importando do seu schema
import { eq } from 'drizzle-orm';
import { session } from '../../drizzle/schema';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    // Busca a sessão
    const sessionData = await db.query.session.findFirst({
      where: eq(session.token, token),
    });

    if (!sessionData) {
      throw new UnauthorizedException('Sessão inválida');
    }

    if (new Date() > sessionData.expiresAt) {
      throw new UnauthorizedException('Sessão expirada');
    }

    // Busca o usuário
    const userData = await db.query.user.findFirst({
        where: eq(schema.user.id, sessionData.userId)
    });

    if (!userData) {
        throw new UnauthorizedException('Usuário não encontrado');
    }

    // Injeta o usuário na requisição
    request['user'] = userData;
    
    return true;
  }
}
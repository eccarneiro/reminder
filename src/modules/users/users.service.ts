import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { db } from '../../db'; // Sua conexão
import { user } from '../../drizzle/schema'; // Seu schema
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  
  // Buscar perfil (Me)
  async findOne(id: string) {
    const foundUser = await db.query.user.findFirst({
      where: eq(user.id, id),
      // Opcional: trazer relações se precisar
      // with: { ownedChannels: true } 
    });

    if (!foundUser) throw new NotFoundException('Usuário não encontrado');
    
    // Dica de segurança: remova dados sensíveis se houver (ex: senha, se tivesse)
    return foundUser;
  }

  // Atualizar perfil
  async update(id: string, updateUserDto: UpdateUserDto) {
    const [updatedUser] = await db
      .update(user)
      .set({
        ...updateUserDto,
        updatedAt: new Date(), // Importante atualizar o timestamp
      })
      .where(eq(user.id, id))
      .returning(); // O 'returning' devolve o objeto atualizado

    return updatedUser;
  }
}
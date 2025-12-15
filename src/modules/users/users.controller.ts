import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(AuthGuard) // 🔒 Protege TUDO aqui
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Rota: GET /users/me
  // Serve para o Frontend saber quem está logado ao abrir o app
  @Get('me')
  getMe(@CurrentUser() user: any) {
    // O user já vem do Guard, mas se quiser garantir dados frescos do banco:
    return this.usersService.findOne(user.id);
  }

  // Rota: PATCH /users/me
  // Atualizar nome ou foto
  @Patch('me')
  updateMe(
    @CurrentUser() user: any, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
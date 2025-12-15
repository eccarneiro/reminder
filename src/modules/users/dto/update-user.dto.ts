import { IsString, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'A imagem deve ser uma URL válida' })
  image?: string;
}
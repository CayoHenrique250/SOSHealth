import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  email!: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password!: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @IsString()
  phone!: string;

  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @IsString()
  address!: string;

  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  @IsIn(['PACIENTE', 'PROFISSIONAL'], {
    message: 'O tipo deve ser PACIENTE ou PROFISSIONAL',
  })
  role!: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  councilNumber?: string;
}

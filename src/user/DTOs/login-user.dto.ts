/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class LoginUserDto {
  /**
   * Correo electrónico registrado del usuario.
   * @example "juan.perez@email.com"
   */
  @ApiProperty({
    example: 'juan.perez@email.com',
    description: 'Correo electrónico con el que el usuario se registró.',
  })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'Debe ser un formato de correo electrónico válido.' })
  email!: string;

  /**
   * Contraseña del usuario.
   * Debe coincidir con la registrada en el sistema.
   * @example "Password1@"
   */
  @ApiProperty({
    example: 'Password1@',
    description:
      'Contraseña del usuario. Debe incluir al menos una letra minúscula, una mayúscula, un número y un carácter especial.',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString()
  @Length(8, 15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe incluir al menos una letra minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*).',
  })
  password!: string;
}

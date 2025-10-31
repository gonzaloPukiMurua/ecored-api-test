/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/address/DTOs/create-adress.dto';

@ValidatorConstraint({ name: 'IsMatchingPasswords', async: false })
export class IsMatchingPasswordsConstraint implements ValidatorConstraintInterface {
  validate(passwordConfirmation: any, args: ValidationArguments) {
    const password = (args.object as CreateUserDto).password;
    return passwordConfirmation === password;
  }
  defaultMessage() {
    return 'La confirmación de la contraseña no coincide con la contraseña.';
  }
}

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @MinLength(3)
  @MaxLength(80)
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password1@' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
  password!: string;

  @ApiPropertyOptional({ example: '1990-05-23', description: 'Fecha de nacimiento del usuario.' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  birthday?: string;

  /** 👇 Nuevo campo anidado */
  @ApiPropertyOptional({
    type: () => CreateAddressDto,
    description: 'Dirección principal del usuario (opcional).',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}

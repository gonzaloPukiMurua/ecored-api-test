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
  Validate,
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

  @ApiProperty({ example: 'Password1@' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsMatchingPasswordsConstraint)
  confirm_password!: string;

  @ApiPropertyOptional({ example: 'Córdoba Capital, Barrio Centro' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  zone_text?: string;

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

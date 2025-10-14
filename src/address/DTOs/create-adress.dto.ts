/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MaxLength, 
  IsLatitude, 
  IsLongitude 
} from 'class-validator';

export class CreateAddressDto {
  /**
   * Calle principal del domicilio.
   * @example "Avenida Siempre Viva"
   */
  @ApiProperty({ example: 'Avenida Siempre Viva', description: 'Calle principal del domicilio.' })
  @IsString()
  @IsNotEmpty({ message: 'La calle es obligatoria.' })
  @MaxLength(100, { message: 'La calle no puede tener más de 100 caracteres.' })
  street!: string;

  /**
   * Número de la calle.
   * @example "742"
   */
  @ApiPropertyOptional({ example: '742', description: 'Número del domicilio.' })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'El número de calle no puede tener más de 20 caracteres.' })
  streetNumber?: string;

  /**
   * Departamento, piso o unidad (opcional).
   * @example "Dpto 3B"
   */
  @ApiPropertyOptional({ example: 'Dpto 3B', description: 'Unidad o piso del domicilio.' })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'El campo apartamento no puede tener más de 50 caracteres.' })
  apartment?: string;

  /**
   * Barrio o zona del domicilio (opcional).
   * @example "Barrio Centro"
   */
  @ApiPropertyOptional({ example: 'Barrio Centro', description: 'Barrio o zona del domicilio.' })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El barrio no puede tener más de 100 caracteres.' })
  neighborhood?: string;

  /**
   * Ciudad del domicilio.
   * @example "Córdoba"
   */
  @ApiProperty({ example: 'Córdoba', description: 'Ciudad o localidad del domicilio.' })
  @IsString()
  @IsNotEmpty({ message: 'La ciudad es obligatoria.' })
  @MaxLength(80, { message: 'La ciudad no puede tener más de 80 caracteres.' })
  city!: string;

  /**
   * Estado o provincia.
   * @example "Córdoba"
   */
  @ApiPropertyOptional({ example: 'Córdoba', description: 'Provincia o estado del domicilio.' })
  @IsOptional()
  @IsString()
  @MaxLength(80, { message: 'El estado no puede tener más de 80 caracteres.' })
  state?: string;

  /**
   * Código postal.
   * @example "5000"
   */
  @ApiPropertyOptional({ example: '5000', description: 'Código postal del domicilio.' })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'El código postal no puede tener más de 20 caracteres.' })
  zipCode?: string;

  /**
   * País.
   * @example "Argentina"
   */
  @ApiProperty({ example: 'Argentina', description: 'País del domicilio.' })
  @IsString()
  @IsNotEmpty({ message: 'El país es obligatorio.' })
  @MaxLength(80, { message: 'El país no puede tener más de 80 caracteres.' })
  country!: string;

  /**
   * Latitud (opcional).
   * @example -31.4201
   */
  @ApiPropertyOptional({ example: -31.4201, description: 'Latitud del domicilio.' })
  @IsOptional()
  @IsLatitude({ message: 'La latitud debe ser un número válido.' })
  latitude?: number;

  /**
   * Longitud (opcional).
   * @example -64.1888
   */
  @ApiPropertyOptional({ example: -64.1888, description: 'Longitud del domicilio.' })
  @IsOptional()
  @IsLongitude({ message: 'La longitud debe ser un número válido.' })
  longitude?: number;

  constructor(partial: Partial<CreateAddressDto>) {
    Object.assign(this, partial);
  }
}

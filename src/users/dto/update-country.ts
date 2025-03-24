import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCountryDto {
  @IsNotEmpty()
  @IsString()
  country: string;
}
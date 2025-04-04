import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30, { message: 'custom message' })
  name: string;

  @MinLength(2)
  @MaxLength(30)
  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  // @IsStrongPassword()
  @IsString()
  password: string;
}

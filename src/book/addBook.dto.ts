import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddBookDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30, { message: 'custom message' })
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  authorsId: number[];
}

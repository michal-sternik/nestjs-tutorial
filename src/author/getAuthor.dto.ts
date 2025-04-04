import { IsNumber, IsPositive } from 'class-validator';

export class GetAuthorDto {
  @IsPositive()
  @IsNumber()
  id: number;
}

import {
  IsString,
  IsNotEmpty,
  IsISO8601,
  IsIn,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsISO8601()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsIn(['work', 'personal', 'shopping', 'other'], {
    message: 'Invalid category',
  })
  category: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

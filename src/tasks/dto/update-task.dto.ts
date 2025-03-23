import { IsString, IsOptional, IsISO8601, IsIn, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsISO8601()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  @IsIn(['work', 'personal', 'shopping', 'other'], { message: 'Invalid category' }) 
  category?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

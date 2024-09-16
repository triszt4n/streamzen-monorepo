import { IsString } from "class-validator";

export class UserDto {
  @IsString()
  fullName: string;

  @IsString()
  email: string;
}

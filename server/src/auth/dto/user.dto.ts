import { IsString } from "class-validator"

export class UserDto {
  id: string

  @IsString()
  fullName: string

  @IsString()
  email: string
}

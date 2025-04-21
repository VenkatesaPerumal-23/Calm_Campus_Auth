import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;
  email:string;
  name:string;
  picture:string;
  fcmToken: string;
}

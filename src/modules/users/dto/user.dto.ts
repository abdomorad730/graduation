import { Transform } from "class-transformer"
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { customPasswordDecorator } from "src/common/decorator/custom.decorator"
import { userGender, userQueryRoles, userRoles } from "src/common/types/types"

export class userDto{
    @IsDate()
    @Transform(({value})=>new Date(value))
    DOB:Date
    @IsEmail()
    email:string
    @MinLength(8)
    password:string
    @MinLength(8)
    @customPasswordDecorator({message:'password not match'})
    cPassword:string
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    lastName:string
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    firstName:string
    @IsString()
    @IsNotEmpty()
    @MinLength(11)
    @MaxLength(13)
    phone:string
    @IsString()
    @IsNotEmpty()
    address: string;
    @IsString()
    @IsEnum(userGender)
    gender:userGender;
    @IsString()
    @IsOptional()
    @IsEnum(userRoles)
    role: string;
    

}
export class confirmEmailDto{
   
    @IsEmail()
    @IsNotEmpty()
    email:string
   
    @IsString()
    @IsNotEmpty()
    otp: string;
    
    

}
export class resetDto{
   
    @IsEmail()
    @IsNotEmpty()
    email:string
   
    @IsString()
    @IsNotEmpty()
    code: string;

    @MinLength(8)
    password:string
    @MinLength(8)
    @customPasswordDecorator({message:'password not match'})
    cPassword:string
    
    

}
export class updatePassDtoDto{
   
    @IsEmail()
    @IsNotEmpty()
    email:string
   
    @MinLength(8)
    oldPassword:string
    
    @MinLength(8)
    password:string
    @MinLength(8)
    @customPasswordDecorator({message:'password not match'})
    cPassword:string
    
    

}
export class paramDto{
    @IsString()
    @IsEnum(userQueryRoles)
    role: string;
}
export class forgetDto{
   
    @IsEmail()
    @IsNotEmpty()
    email:string
   

    
    

}
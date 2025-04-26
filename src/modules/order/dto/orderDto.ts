import { Type } from "class-transformer";
import {  IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class orderDto{
   
   
    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    paymentMethod:string
  
    
    

}
export class paymentDto{
   
   
    @Type(()=>Types.ObjectId)
    @IsNotEmpty()
    orderId: Types.ObjectId;

    @IsOptional()
    @IsString()
    code:string;
    
    

}
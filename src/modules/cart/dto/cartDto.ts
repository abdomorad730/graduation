import { Type } from "class-transformer";
import {  IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { Types } from "mongoose";

export class cartDto{
   
   
    @Type(()=>Types.ObjectId)
    @IsNotEmpty()
    productId: Types.ObjectId;
    @Type(()=>Number)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    quantity: number;
    
    

}
export class removeFromCartDto{
   
   
    @Type(()=>Types.ObjectId)
    @IsNotEmpty()
    productId: Types.ObjectId;

    
    

}
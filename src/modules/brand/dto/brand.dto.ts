import { Type } from "class-transformer";
import {  IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class updateBrandDto{
   
   
    @IsString()
    @IsOptional()
    name: string;
    
    

}
export class brandDto{
   
   
    @IsString()
    @IsNotEmpty()
    name: string;

    @Type(()=>Types.ObjectId)
    @IsNotEmpty()
    category: Types.ObjectId;
    
    

}
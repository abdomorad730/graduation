import { Type } from "class-transformer";
import {   IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { Types } from "mongoose";
import { QueryFilterDto } from "src/common/utils/QueryFilterDto";

export class ProductDto{
   
   
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsString()

    describtion: string;
    @Type(()=>Number)
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @Validate((value:Types.ObjectId)=>{
        return Types.ObjectId.isValid(value)
    })
    category: Types.ObjectId;
    //@IsNotEmpty()
    @Validate((value:Types.ObjectId)=>{
        return Types.ObjectId.isValid(value)
    })
    subCategory: Types.ObjectId;
    //@IsNotEmpty()
    @Validate((value:Types.ObjectId)=>{
        return Types.ObjectId.isValid(value)
    })
    brand: Types.ObjectId;
    imageCover: object;

    @Type(()=>Number)
    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @Type(()=>Number)
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @Type(()=>Number)
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    rate: number;

    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    avgRating: number;

    @IsOptional()
    images: object[];


    
    

}
export class updateProductDto{
   
   
    @IsString()
    @IsOptional()
    name: string;
    @IsOptional()
    @IsString()

    describtion: string;
    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    price: number;

    @IsOptional()
    @Validate((value:Types.ObjectId)=>{
        return Types.ObjectId.isValid(value)
    })
    category: Types.ObjectId;
    //@IsOptional()
    @Validate((value:Types.ObjectId)=>{
        return Types.ObjectId.isValid(value)
    })
    subCategory: Types.ObjectId;
    //@IsOptional()
    @Validate((value:Types.ObjectId)=>{
        return Types.ObjectId.isValid(value)
    })
    brand: Types.ObjectId;
    imageCover: object;

    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    discount: number;

    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    stock: number;

    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    quantity: number;

    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    rate: number;

    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    avgRating: number;

    @IsOptional()
    images: object[];


    
    

}
export class queryDto extends QueryFilterDto{
    @IsString()
    @IsOptional()
    name: string;
}
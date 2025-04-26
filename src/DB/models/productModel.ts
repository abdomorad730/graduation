import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import {  object } from 'zod';
import { User } from './users.model';
import { Category } from './category.model';
import { SubCategory } from './subCategory.model';
import { Brand } from './brand.model';



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Product {


    @Prop({ type: String, minlength: 3,trim:true,required: true })
    name: string;

    @Prop({ type: String, required: true, default:function(){
        return slugify(this.name,{replacement:'-',lower:true,trim:true})
    } })
    slug: string;

    @Prop({ type: String, minlength: 3,trim:true,required: true })
    describtion: string;

    @Prop({ type: String, minlength: 3,trim:true,required: true })
    customId: string;

    @Prop({ type: Types.ObjectId,ref:'User',required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId,ref:'Category',required: true })
    category: Types.ObjectId;

    @Prop({ type: Types.ObjectId,ref:SubCategory.name,required: true })
    subCategory: Types.ObjectId;

    @Prop({ type: Types.ObjectId,ref:Brand.name,required: true})
    brand: Types.ObjectId;

    @Prop({ type: object ,required:true})
    imageCover:object;

    @Prop({ type: [object]})
    images:object[];

    @Prop({ type: Number,required: true })
    price:number

    @Prop({ type: Number,required: true,min:1,max:100 })
    discount:number

    @Prop({ type: Number,required: true })
    stock:number

    @Prop({ type: Number,required: true })
    quantity:number

    @Prop({ type: Number,required: true })
    subPrice:number

    @Prop({ type: Number,required: true })
    rate:number  
    
    @Prop({ type: Number,required: true })
    avgRating:number


   
}
export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
export type ProductDocument = HydratedDocument<Product>;

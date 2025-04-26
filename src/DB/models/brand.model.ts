import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { object } from 'zod';
import { Category ,SubCategory,User} from './index';



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Brand {


    @Prop({ type: String, minlength: 3,trim:true,required: true, unique:true})
    name: string;

    @Prop({ type: String, required: true, default:function(){
        return slugify(this.name,{lower:true,trim:true})
    } })
    slug: string;

    @Prop({ type: Types.ObjectId,ref:'User',required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId,ref:'Category',required: true })
    category: Types.ObjectId;


    @Prop({ type: object})
    image:object;

    @Prop({type: String})
    customId:string;



   
}
export const BrandSchema = SchemaFactory.createForClass(Brand);
export const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }])
export type BrandDocument = HydratedDocument<Brand>;

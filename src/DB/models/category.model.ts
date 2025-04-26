import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './users.model';
import { object, string } from 'zod';



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Category {


    @Prop({ type: String, minlength: 3,trim:true,unique:true,required: true,lowercase:true })
    name: string;

    @Prop({ type: String, required: true, default:function(){
        return slugify(this.name,{lower:true,trim:true})
    } })
    slug: string;

    @Prop({ type: Types.ObjectId,ref:User.name,required: true })
    userId: Types.ObjectId;

    @Prop({ type: object})
    image:object;


    @Prop({type: String})
    customId:string;
    


   
}
export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
export type CategoryDocument = HydratedDocument<Category>;

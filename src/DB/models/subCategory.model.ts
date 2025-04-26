import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { Category} from './category.model'
import { User } from './users.model';




@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class SubCategory {


    @Prop({ type: String, minlength: 3,trim:true,required: true })
    name: string;

    @Prop({ type: String, required: true, default:function(){
        return slugify(this.name,{lower:true,trim:true})
    } })
    slug: string;
    @Prop({ type: Types.ObjectId,ref:'User',required: true })
    userId: Types.ObjectId;
    

    @Prop({ type: Types.ObjectId,ref:'Category',required: true })
    category: Types.ObjectId;

    @Prop({ type: Object})
    image:object;



   
}
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
export const SubCategoryModel = MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema }])
export type SubCategoryDocument = HydratedDocument<SubCategory>;

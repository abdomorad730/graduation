import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { object } from 'zod';
import { Category ,SubCategory,User} from './index';
import { userOtp } from 'src/common/types/types';



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class OTP {


    @Prop({ type: String, required: true })
    otp: string;
     
    @Prop({ type: String,enum:userOtp, required: true })
    type: string;

    @Prop({ type: Date })
    expireAt?:Date

    @Prop({ type: Types.ObjectId,ref:User.name,required: true })
    userId: Types.ObjectId;





   
}
export const OTPSchema = SchemaFactory.createForClass(OTP);
export const OTPModel = MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])
export type OTPDocument = HydratedDocument<OTP>;

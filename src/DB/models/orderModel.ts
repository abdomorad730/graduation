import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User,Cart } from "./index";
import { paymentMethods, status } from "src/common/types/types";

@Schema({timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})
export class Order{


    @Prop({type:Types.ObjectId,ref:User.name,required:true})
    userId:Types.ObjectId


    @Prop({ type:Types.ObjectId,ref:Cart.name,required:true})
    cartId:Types.ObjectId


    @Prop({type:Number})
    TotalPrice:number

    @Prop({ type: String, required: true })
    phone: string;

    @Prop({ type: String, required: true })
    address: string;

    @Prop({ type: String,enum:paymentMethods, required: true })
    paymentMethod: string;

    @Prop({ type: String,enum:status, required: true })
    status: string;

    @Prop({ type: Date,default:Date.now()+3*24*60*60*1000 })
    arrivedAt:Date

    @Prop({type:{
        paidAt:Date,
        delveredAt:Date,
        deliveredBy:{ type:Types.ObjectId,ref:User.name},
        cancelledAt:Date,
        cancelledBy:{ type:Types.ObjectId,ref:User.name},
        refundedAt:Date,
        refundedBy:{ type:Types.ObjectId,ref:User.name},
    }})
    orderChanged:object
    @Prop({type:String})
    paymentIntent:string
    


}
export const OrderSchema=SchemaFactory.createForClass(Order)
export const OrderModel = MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
export type OrderDocument = HydratedDocument<Order>;
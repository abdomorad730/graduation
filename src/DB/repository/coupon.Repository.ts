import { InjectModel } from "@nestjs/mongoose";
import { Coupon, CouponDocument } from "../models/index";
import { repository } from "./DB.repository";
import { Model } from "mongoose";

export class CouponRepository extends repository<CouponDocument>{
    constructor(@InjectModel(Coupon.name) private _CouponModel:Model<CouponDocument>){
        super(_CouponModel)
    }
}
import { InjectModel } from "@nestjs/mongoose";
import { OTP, OTPDocument } from "../models/index";
import { repository } from "./DB.repository";
import { Model, Types } from "mongoose";
import { userOtp } from "src/common/types/types";
interface otpOptions {
    otp: string,
    expireAt: Date,
    type: userOtp,
    userId: Types.ObjectId
}
export class OTPRepository extends repository<OTPDocument> {
    constructor(@InjectModel(OTP.name) private _OTPModel: Model<OTPDocument>) {
        super(_OTPModel)
    }
    createOtp({ otp, expireAt, type, userId }: otpOptions) {
        return this.create({
            otp,
            type,
            userId,
            expireAt: expireAt || new Date(Date.now() + 1000 * 60 * 10),

        })
    }
}
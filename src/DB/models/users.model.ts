import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { hash } from 'src/common/security/hash';
import { encrypt } from 'src/common/service/crypto';
import { userGender, userRoles } from 'src/common/types/types';
import { Product } from './productModel';



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
    @Prop({ type: String, minlength: 3, required: true })
    firstName: string;

    @Prop({ type: String, minlength: 3, required: true })
    lastName: string;

    @Virtual({
        get: function (this: User) {
            return `${this.firstName} ${this.lastName}`;
        },
    })
    name: string;

    @Prop({ type: Date, required: true })
    DOB: Date;

    @Prop({ type: String, required: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ })
    email: string;

    @Prop({ type: String, required: true, minlength: 8 })
    password: string;

    @Prop({ type: String, required: true })
    phone: string;

    @Prop({ type: String, required: true })
    address: string;
    @Prop({ type: String, required: true, enum: userGender })
    gender: userGender;

    @Prop({ type: Boolean, default: false })
    confirmed: boolean;

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop({ type: String, enum: userRoles, default: userRoles.user })
    role: string;

    @Prop({ type: [Types.ObjectId], ref:Product.name })
    washlist: Types.ObjectId[]

}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre("save", function (next) {
    if (this.isDirectModified("password")) {
        this.password = hash(this.password, 12)
    }
    if (this.isDirectModified("phone")) {
        this.phone = encrypt(this.phone, process.env.encrypt_key)
    }
    next()
})
export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
export type UserDocument = HydratedDocument<User>;


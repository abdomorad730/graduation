import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument } from "../models/index";
import { repository } from "./DB.repository";
import { Model } from "mongoose";

export class CartRepository extends repository<CartDocument>{
    constructor(@InjectModel(Cart.name) private _CartModel:Model<CartDocument>){
        super(_CartModel)
    }
}
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument } from "../models/index";
import { repository } from "./DB.repository";
import { Model } from "mongoose";

export class OrderRepository extends repository<OrderDocument>{
    constructor(@InjectModel(Order.name) private _OrderModel:Model<OrderDocument>){
        super(_OrderModel)
    }
}
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument } from "../models/index";
import { repository } from "./DB.repository";
import { Model } from "mongoose";

export class ProductRepository extends repository<ProductDocument>{
    constructor(@InjectModel(Product.name) private _ProductModel:Model<ProductDocument>){
        super(_ProductModel)
    }
}
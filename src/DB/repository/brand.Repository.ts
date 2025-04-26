import { InjectModel } from "@nestjs/mongoose";
import { Brand, BrandDocument } from "../models/index";
import { repository } from "./DB.repository";
import { Model } from "mongoose";

export class BrandRepository extends repository<BrandDocument>{
    constructor(@InjectModel(Brand.name) private _BrandModel:Model<BrandDocument>){
        super(_BrandModel)
    }
}
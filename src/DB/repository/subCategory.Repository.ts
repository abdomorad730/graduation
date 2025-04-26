import { InjectModel } from "@nestjs/mongoose";
import { SubCategory, SubCategoryDocument } from "../models/index";
import { repository } from "./DB.repository";
import { Model } from "mongoose";

export class SubCategoryRepository extends repository<SubCategoryDocument>{
    constructor(@InjectModel(SubCategory.name) private _SubCategoryModel:Model<SubCategoryDocument>){
        super(_SubCategoryModel)
    }
}
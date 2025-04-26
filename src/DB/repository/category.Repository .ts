import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "../models/index";
import { repository } from "./DB.repository";
import { Model } from "mongoose";

export class CategoryRepository extends repository<CategoryDocument>{
    constructor(@InjectModel(Category.name) private _CategoryModel:Model<CategoryDocument>){
        super(_CategoryModel)
    }
}
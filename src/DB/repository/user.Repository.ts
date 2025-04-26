import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/users.model";
import { repository } from "./DB.repository";
import { Model } from "mongoose";

export class userRepository extends repository<User>{
    constructor(@InjectModel(User.name) private _userModel:Model<User>){
        super(_userModel)
    }
}
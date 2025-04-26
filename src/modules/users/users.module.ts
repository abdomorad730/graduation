import { Module } from "@nestjs/common";
import { userController } from "./users.controller";
import { userService } from "./users.service";
import { UserModel } from "src/DB/models/users.model";
import { userRepository } from "src/DB/repository/user.Repository";
import { tokenService } from "src/common/service/tokenService";
import { JwtService } from "@nestjs/jwt";
import { OTPRepository, ProductRepository } from "src/DB/repository";
import { OTPModel, ProductModel } from "src/DB/models";

@Module({
    imports:[UserModel,OTPModel,ProductModel],
    controllers:[userController],
    providers:[userService,userRepository,tokenService,JwtService,OTPRepository,ProductRepository]

})
export  class userModule{}
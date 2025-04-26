import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
@Injectable()
export class tokenService{
    constructor(private jwtService: JwtService){}
     generateToken(payload:any,options:JwtSignOptions):string{
        return this.jwtService.sign(payload,options)
    }
     VerifyToken(payload:any,options:JwtVerifyOptions):any{
        return this.jwtService.verify(payload,options)
    }
}
import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { hash, verifyHash } from "src/common/security/hash";
import { tokenService } from "src/common/service/tokenService";
import { userOtp } from "src/common/types/types";
import { sendEmail } from "src/common/utils/sendEmail";
import { User, UserDocument } from "src/DB/models/users.model";
import { OTPRepository, ProductRepository } from "src/DB/repository";
import { userRepository } from "src/DB/repository/user.Repository";
import { confirmEmailDto, forgetDto, paramDto, resetDto, updatePassDtoDto, userDto } from "./dto/user.dto";

@Injectable()
export class userService {
    constructor(
        private readonly userRepository: userRepository,
        private readonly tokenService: tokenService,
        private readonly OTPRepository: OTPRepository,    
            private readonly ProductRepository: ProductRepository




    ) { }
    async dashboard(user:UserDocument){
        const data =await Promise.allSettled([
            await this.ProductRepository.find({}),
            await this.userRepository.find({})
       ])
        return{data}
    }

    async SignUp(body: userDto ,ss:paramDto): Promise<any> {
        try {
            const{role}=ss

            const { firstName, lastName, email, password, gender, address, phone, DOB } = body
            const userExist = await this.userRepository.findOne({ email })
            if (userExist) {
                throw new ConflictException('email already exist')
            }


            const user = await this.userRepository.create({ firstName, lastName, email, password, gender, address, phone, DOB,role })

            const code = Math.floor(Math.random() * (999 - 8) + 254).toString()
            await this.OTPRepository.createOtp({ otp: hash(code, 12), userId: user['_id'], expireAt: new Date(Date.now() + 1000 * 60 * 10), type: userOtp.email })
            sendEmail({ to: email, subject: 'confirm email', html: `<h1>${code}</h1>` })


            return user
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
    async forgetPassword(body: forgetDto) {
        const { email } = body
        const user = await this.userRepository.findOne({ email, confirmed: true })
        if (!user) {
            throw new NotFoundException('user not found')
        }
        await this.OTPRepository.findOneAndDelete({userId:user['_id'],type:userOtp.password})
        const code = Math.floor(Math.random() * (999 - 8) + 254).toString()
        await this.OTPRepository.createOtp({ otp: hash(code, 12), userId: user['_id'], expireAt: new Date(Date.now() + 1000 * 60 * 10), type: userOtp.password })
        sendEmail({ to: email, subject: 'forget password', html: `<h1>${code}</h1>` })
        return { message: 'done' }

    }
    async resetPassword(body: resetDto) {
        const { email, code, password, cPassword } = body
        const user = await this.userRepository.findOne({ email, confirmed: true })
        if (!user) {
            throw new NotFoundException('user not found')
        }
        const otp =await this.OTPRepository.findOne({userId:user['_id'],type:userOtp.password})
        if(!otp){
            throw new NotFoundException('otp not found')
        }
        const compareOTP= verifyHash(code,otp.otp)
        if(!compareOTP){
            throw new ForbiddenException('invalid code')
        }
        const hashPass= hash(password,12)
        const newUser=await this.userRepository.findOneAndUpdate({email},{password:hashPass})
        await this.OTPRepository.findOneAndDelete({userId:user['_id'],type:userOtp.password})


        return{message:'done', user:newUser}

    }
    async updatePassword(body:updatePassDtoDto ,user:UserDocument){
        const { oldPassword, password, cPassword } = body
        const comparePassword=verifyHash(oldPassword,user.password)
        if(!comparePassword){
            throw new ForbiddenException('incorrect Password')
        }
        if(password != cPassword){
            throw new ForbiddenException(' Password and cPassword not match')
        }
        const hashPass=hash(password,12)
        const newUser=await this.userRepository.findOneAndUpdate({_id:user._id},{password:hashPass})
        return{message:'done', user:newUser}
    }

    async confirmEmail(body: confirmEmailDto): Promise<any> {
        try {
            const { email, otp } = body
            const user = await this.userRepository.findOne({ email, confirmed: false })
            if (!user) {
                throw new NotFoundException('user Not found')
            }
            const otpExist = await this.OTPRepository.findOne({ userId: user['_id'], type: userOtp.email })
            if (!otpExist) {
                throw new ForbiddenException('otp not exist')

            }
            if (!verifyHash(otp, otpExist.otp)) {
                throw new ConflictException('otp is incorrect')
            }
            const expireAt = otpExist.expireAt || 17779034235
            if (new Date() > expireAt) {
                throw new ConflictException('otp is expired')

            }
            const newUser = await this.userRepository.findOneAndUpdate({ email }, { confirmed: true })
            await this.OTPRepository.findOneAndDelete({ _id: otpExist._id })

            return newUser
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }


    async SignIn(body: any): Promise<any> {
        try {
            const { email, password } = body
            const userExist = await this.userRepository.findOne({ email, confirmed: true })
            if (!userExist) {
                throw new ConflictException('email not exist')
            }
            if (!verifyHash(password, userExist.password)) {
                throw new ConflictException('password is incorrect')
            }
            const access_token = this.tokenService.generateToken({ email, id: userExist['_id'],role:userExist.role ,name:userExist.firstName+" "+userExist.lastName}, { secret: process.env.SECRET_KEY, expiresIn: '1w' })
            const refresh_token = this.tokenService.generateToken({ email, id: userExist['_id'] ,role:userExist.role,name:userExist.firstName+" "+userExist.lastName}, { secret: process.env.SECRET_KEY, expiresIn: '1y' })


            return { msg: 'done', access_token, refresh_token }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }



}
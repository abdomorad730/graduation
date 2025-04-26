import { BadRequestException, Injectable } from '@nestjs/common';
import { couponDto } from './dto/couponDto';
import { UserDocument } from 'src/DB/models';
import { CouponRepository } from 'src/DB/repository';

@Injectable()
export class CouponService {
    constructor(
        private readonly CouponRepository:CouponRepository,

    ) { }
    async createCoupon(body:couponDto,user:UserDocument){
        const {code,amount,fromDate,toDate}=body
        const couponExist=await this.CouponRepository.findOne({code})
        if(couponExist){
            throw new BadRequestException('coupon already Exist')
        }
        const coupon = await this.CouponRepository.create({code,amount,fromDate,toDate,userId:user._id})
        return {coupon}
    }
}

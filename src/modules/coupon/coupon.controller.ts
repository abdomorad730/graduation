import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth.decorator';
import { userRoles } from 'src/common/types/types';
import { couponDto } from './dto/couponDto';
import { UserDocument } from 'src/DB/models';
import { User } from 'src/common/decorator/user.decorator';
import { CouponService } from './coupon.service';

@Controller('coupon')
export class CouponController {

        constructor(private readonly _CouponService: CouponService) { }
        
        @Post("/create")
        @Auth(userRoles.admin)
        @UsePipes(new ValidationPipe())
        async createCoupon(
            @Body() body: couponDto,
            @User() user: UserDocument) {
            return this._CouponService.createCoupon(body, user)
    
        }
    
}

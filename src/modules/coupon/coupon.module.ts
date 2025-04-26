import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { AuthGuard } from 'src/common/guard/userGuard';
import { CouponRepository } from 'src/DB/repository';
import { CouponModel } from 'src/DB/models';

@Module({
  imports:[CouponModel],
  controllers:[CouponController],
  providers: [CouponService,CouponRepository]

})
export class CouponModule {}

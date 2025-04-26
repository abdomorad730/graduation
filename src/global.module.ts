
import { Module, Global } from '@nestjs/common';
import { UserModel } from './DB/models';
import { JwtService } from '@nestjs/jwt';
import { tokenService } from './common/service/tokenService';
import { userRepository } from './DB/repository';

@Global()
@Module({
    imports:[UserModel],
  controllers: [],
  providers: [JwtService,tokenService,userRepository],
  exports: [JwtService,tokenService,userRepository,UserModel],
})
export class GlobalModule {}

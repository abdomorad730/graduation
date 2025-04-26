
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { tokenService } from '../service/tokenService';
import { userRepository } from 'src/DB/repository/user.Repository';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private tokenService: tokenService,
        private readonly userRepository: userRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.split(' ')[1] ?? []
        if (!token) {
            throw new UnauthorizedException('Token Not Found');
        }
        try {
            const payload = await this.tokenService.VerifyToken(
                token,
                {
                    secret: process.env.SECRET_KEY
                }
            );
            const user = await this.userRepository.findOne({ email: payload.email})
            if (!user) {
                throw new ForbiddenException('User Not ')
            }
            request['user'] = user;
        } catch(error) {
            throw new UnauthorizedException(error);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

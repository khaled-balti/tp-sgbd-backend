import { Injectable } from '@nestjs/common';
import { LoginPayload } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as brcypt from 'bcrypt'
@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UserService) {}
    async validateUser(loginPayload: LoginPayload) {
        const {email, password} = loginPayload
        const user = await this.userService.findOneByEmail(email)
        if (!user) return null
        const valid = await brcypt.compare(password, user?.password)
        if (valid) {
            const {password, ...userInputs} = user
            return this.jwtService.sign(userInputs)
        } 
    }
}

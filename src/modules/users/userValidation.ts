import { ForbiddenException } from "@nestjs/common";
import { z } from "zod";
export const userValidation=z.object({
    name:z.string().min(3),
    email:z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    password:z.string().min(8),
    cPassword:z.string().min(8),
    age:z.number()

}).superRefine((value,ctx)=>{
    if(value.password!==value.cPassword){
        throw new ForbiddenException('invalidPassword or cpassword')
    }
})
export type userValidationDto = z.infer<typeof userValidation>;

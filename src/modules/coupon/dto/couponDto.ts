import { Type } from "class-transformer";
import {  IsDate, IsNotEmpty, IsNumber, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
@ValidatorConstraint({  async: true })
export class toDateValidation implements ValidatorConstraintInterface {
  validate(toDate: Date, args: ValidationArguments) {
    if(toDate<args.object['fromDate']){
        return false
    }
    return true
}

  defaultMessage(args: ValidationArguments) {
    return `${args.property}must be after ${args.object['fromDate']}`;
  }
}
@ValidatorConstraint({  async: true })
export class fromDateValidation implements ValidatorConstraintInterface {
  validate(fromDate: Date, args: ValidationArguments) {
  
return fromDate >= new Date()
}

  defaultMessage(args: ValidationArguments) {
    return `FromDate must be in Future`;
  }
}
export class couponDto{
   
   
    @IsString()
    @IsNotEmpty()
    code: string;
    @Type(()=>Number)
    @IsNotEmpty()
    @IsNumber()
    amount:number

    @Type(()=>Date)
    @IsNotEmpty()
    @IsDate()
    @Validate(fromDateValidation)
    fromDate:Date

    @Type(()=>Date)
    @IsNotEmpty()
    @IsDate()
    @Validate(toDateValidation)
    toDate:Date

    
    

}
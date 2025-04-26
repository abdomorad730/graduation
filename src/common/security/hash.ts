import * as bcrypt from 'bcrypt'
export const hash= (plainText:string,saltRoundes:number ):string=>{
    return  bcrypt.hashSync(plainText,saltRoundes)
}
export const verifyHash= (plainText:string,hash:string):boolean=>{
    return  bcrypt.compareSync(plainText,hash)
}
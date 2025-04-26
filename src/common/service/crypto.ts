import * as CryptoJS from 'crypto-js'

export const encrypt = (plainText:string,secret:string=process.env.encrypt_key as string)=>{
    return  CryptoJS.AES.encrypt(plainText, secret).toString()
}

export const decrypt = (plainText:string,secret:string=process.env.encrypt_key as string)=>{
    const bytes=CryptoJS.AES.decrypt(plainText, secret)
    return  bytes.toString(CryptoJS.enc.Utf8);
}
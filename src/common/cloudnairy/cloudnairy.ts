import { v2 as cloudinary } from "cloudinary";
export const cloudinaryConfig=()=>{
    cloudinary.config({
        api_key:process.env.API_KEY,
        cloud_name:process.env.CLOUD_NAME,
        api_secret:process.env.SECRET_KEY2

    })
    return cloudinary
}


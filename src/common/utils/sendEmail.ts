import {SendMailOptions,createTransport} from "nodemailer"

export const sendEmail =async (data:SendMailOptions)=>{

    const transporter = createTransport({
      host: "smtp.gmail.email",
      service:"gmail",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL,
        pass:  process.env.PASSWORD,
      },
    });
    
      const info = await transporter.sendMail({
        from: `"Maddison Foo Koch 👻" <${ process.env.EMAIL}>`, 
        ...data
      });
    
      console.log("Message sent: %s", info);
    
    
}
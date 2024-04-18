import nodemailer from 'nodemailer';

const sendMail = async (email, otp) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "OTP for verification",
        text: `Your OTP is ${otp}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

export default sendMail;
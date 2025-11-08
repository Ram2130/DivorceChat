import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:"gajanandprajapat843@gmail.com",
      pass:"jqkmytyihbghoqjn" ,
    },
  });

  const mailOptions = {
    from: "gajanandprajapat843@gmail.com",
    to: email,
    subject: 'Your OTP for Connect Hub',
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

import User from "@/models/user.model";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const user = await User.findOne({ _id: userId });

    const otp = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false
    });

    if (emailType === "VERIFY") {
      user.verifyToken = otp;
      user.verifyTokenExpiry = new Date(Date.now() + 120000);
    } else if (emailType === "RESET") {
      user.resetPasswordToken = otp;
      user.resetPasswordTokenExpiry = new Date(Date.now() + 120000);
    }

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_EMAIL_ID,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Dev Account" <${ process.env.MAILER_EMAIL_ID }>`,
      to: email,
      replyTo: process.env.MAILER_EMAIL_ID,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `your otp is <b>${otp}</b> and valid for 2 minutes.`,
    };

    const mailerResponse = await transporter.sendMail(mailOptions);
    return mailerResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

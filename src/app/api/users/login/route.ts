import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

// Database Connection
connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Check if user does not exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: user._id });

    // create token data
    // const tokenData = {
    //     id: user._id,
    //     username: user.username,
    //     email: user.email
    // }

    // // create token
    // const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {
    //     expiresIn: "1d"
    // });

    // const response = NextResponse.json({
    //     message: "User logged in successfully.",
    //     success: true
    // },{ status: 200 });

    // response.cookies.set("token", token, {
    //     httpOnly: true
    // });

    return NextResponse.json({
      message: "Please Verify yourself.",
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

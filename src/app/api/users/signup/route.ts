import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import { sendEmail } from "@/helpers/mailer";

// Database Connection
connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    
    // Send verification email
    // await sendEmail({ email, emailType: "VERIFY", userId: newUser._id });

    const savedUser = await newUser.save();

    // Send verification email
    // const verifyUrl = `http://localhost:3000/verify-email?token=${savedUser.verifyToken}`;
    // await sendEmail(email, verifyUrl);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        savedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

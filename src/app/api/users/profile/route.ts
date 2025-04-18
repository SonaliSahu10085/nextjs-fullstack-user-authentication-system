import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user.model";
import { connectDb } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Database Connection
connectDb();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    // console.log(userId);
    const user = await User.findOne({ _id: userId }).select("-password");
    return NextResponse.json(
      {
        success: true,
        message: "User details fetched successfully.",
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
  }
}

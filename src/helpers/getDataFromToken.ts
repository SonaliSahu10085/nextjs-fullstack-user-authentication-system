import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = async(request: NextRequest) => {
  try {
    //encoded token
    const token = request.cookies.get("token")?.value || "";

    //decoded token
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    // console.log("decodedToken", decodedToken);
    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

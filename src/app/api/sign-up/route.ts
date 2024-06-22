import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already Exist",
        },
        { status: 400 }
      );
    }

    const existinguserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existinguserByEmail) {
      //if user with this email already exist and is also verified
      if (existinguserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        //if user with this email already exist but is NOT verified or haven't verified yet,then override the password of existing user
        const hashedPassword = await bcrypt.hash(password, 10);
        existinguserByEmail.password = hashedPassword;
        existinguserByEmail.verifyCode = verifyCode;
        existinguserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 3600000==> 1 Hour
        await existinguserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Registered Sucefully. Please Verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registring User", error);
    return Response.json(
      {
        success: false,
        message: "Error registring user",
      },
      { status: 500 }
    );
  }
}

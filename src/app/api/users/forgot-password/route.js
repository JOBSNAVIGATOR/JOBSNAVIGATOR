import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

export async function PUT(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    //extract the credentials
    const { email } = await request.json();
    //Check if the user Already exists in the db
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User Not Found with ( ${email})  `,
        },
        { status: 404 }
      );
    }

    // generate token

    // genrate a random UUID (version 4)
    const rawToken = uuidv4();

    // Encode the token using Base64 URL- safe format
    const token = base64url.encode(rawToken);

    // update a user
    const updatedUser = await db.user.update({
      where: {
        email,
      },
      data: {
        passwordResetToken: token,
      },
    });
    console.log(updatedUser);

    // Send an email with the token on the link as a search param

    const userId = existingUser.id;
    const linkText = "Reset Password";
    const redirectUrl = `reset-password?token=${token}&id=${userId}`;
    const name = existingUser.name;
    const sendMail = await resend.emails.send({
      from: "LifeEasyWay <info@lifeeasyway.com>",
      to: email,
      subject: "Account Verification from Auth System",
      react: EmailTemplate({ name, redirectUrl, linkText }),
    });

    console.log(sendMail);
    console.log(rawToken);
    console.log(token);
    return NextResponse.json(
      {
        data: updatedUser,
        message: "User Updated Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Server Error: Something went wrong",
      },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Users",
        error,
      },
      { status: 500 }
    );
  }
}

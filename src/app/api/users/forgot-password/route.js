import db from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import createTransporter from "@/lib/email";
import { userEmailTemplate } from "@/lib/userEmailTemplate";

export async function PUT(request) {
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
    // console.log(updatedUser);
    const transporter = createTransporter();
    const linkText = "Reset Password";
    const userId = existingUser.id;
    const name = existingUser.name;
    const redirectUrl = `reset-password?token=${token}&id=${userId}`;
    const description = `Thank you for contacting JOBSNAVIGATOR. We request you to click
                on the link below to ${linkText}. Thank you!`;
    const emailHtml = userEmailTemplate(
      name,
      description,
      linkText,
      redirectUrl
    );

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Recipient address
      subject: "Password Reset from JOBSNAVIGATOR",
      html: emailHtml,
    };
    try {
      await transporter.sendMail(mailOptions);
      // console.log("Email sent successfully to:", email);
    } catch (mailError) {
      console.error("Failed to send email:", mailError);
    }
    return NextResponse.json(
      {
        data: updatedUser,
        message: "User Updated Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // console.log(error);
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
    // console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Users",
        error,
      },
      { status: 500 }
    );
  }
}

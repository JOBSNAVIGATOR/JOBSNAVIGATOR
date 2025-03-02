import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { PrismaClient } from "@prisma/client";
import createTransporter from "@/lib/email";
import { userEmailTemplate } from "@/lib/userEmailTemplate";

export async function POST(request) {
  // const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    //extract the credentials
    const { name, email, password, role, contactNumber } = await request.json();
    //Check if the user Already exists in the db
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User with this email ( ${email})  already exists in the Database`,
        },
        { status: 409 }
      );
    }
    // Encrypt the Password =>bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate token
    // genrate a random UUID (version 4)
    const rawToken = uuidv4();
    // Encode the token using Base64 URL- safe format
    const token = base64url.encode(rawToken);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        contactNumber,
        password,
        hashedPassword,
        role,
        verificationToken: token,
      },
    });
    // console.log(newUser);

    const transporter = createTransporter();
    const linkText = "Verify Account";
    const userId = newUser.id;
    const redirectUrl = `login?token=${token}&id=${userId}`;
    const description = `Thank you for creating an account with us. We request you to click
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
      subject: "Account Verification from JOBSNAVIGATOR",
      html: emailHtml,
    };
    try {
      await transporter.sendMail(mailOptions);
      // console.log("Email sent successfully to:", email);
    } catch (mailError) {
      console.error("Failed to send email:", mailError);
    }

    // Send an email with the token on the link as a search param
    // const userId = newUser.id;
    // const linkText = "Verify Account";
    // const redirectUrl = `login?token=${token}&id=${userId}`;
    // const sendMail = await resend.emails.send({
    //   from: "LifeEasyWay <info@lifeeasyway.com>",
    //   to: email,
    //   subject: "Account Verification from JOBSNAVIGATOR",
    //   react: EmailTemplate({ name, redirectUrl, linkText }),
    // });

    // console.log(sendMail);
    // console.log(rawToken);
    // console.log(token);

    return NextResponse.json(
      {
        data: newUser,
        message: "User Created Successfully",
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
// export async function GET(request) {
//   try {
//     const { email } = await request.json();
//     const user = await db.user.findUnique({
//       where: {
//         email,
//       },
//     });
//     return NextResponse.json(user);
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       {
//         message: "Failed to Fetch User",
//         error,
//       },
//       { status: 500 }
//     );
//   }
// }

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Extract email from query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user by email in the database
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        emailVerified: true, // Only select fields you need
        role: true,
        candidateProfile: true,
        consultantProfile: true,
        clientProfile: true,
      },
    });

    // Check if the user exists
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user data
    // console.log(user);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    // console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}

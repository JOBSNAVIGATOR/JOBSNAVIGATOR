import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import createTransporter from "@/lib/email"; // Import the transporter function
import { getServerSession } from "next-auth";

// Helper function to replace specific placeholders
function replacePlaceholders(template, candidate) {
  return template
    .replace(/{{name}}/g, candidate.name || "")
    .replace(/{{code}}/g, candidate.candidateCode || "");
}

export async function POST(request) {
  const { templateName, subject, content, userName, candidates } =
    await request.json(); // Get the list of candidates
  // console.log(templateName, subject, content, userName, candidates);

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return new Response(
      JSON.stringify({ message: "No candidates provided." }),
      { status: 400 }
    );
  }

  // Use the reusable transporter from the lib
  const transporter = createTransporter();

  // // Prepare email promises for each candidate
  const emailPromises = candidates.map((candidate) => {
    // Replace placeholders in subject and content
    const personalizedSubject = replacePlaceholders(subject, candidate);
    const personalizedContent = replacePlaceholders(content, candidate);

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: candidate.email, // Recipient address
      subject: personalizedSubject, // Subject line
      html: personalizedContent, // HTML body
    };

    return transporter.sendMail(mailOptions);
  });
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return new Response(
      JSON.stringify({ message: "User not authenticated." }),
      { status: 401 }
    );
  }
  const consultantData = await db.consultantProfile.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!consultantData) {
    return NextResponse.json(
      {
        data: null,
        message: "No Consultant Profile Found, Please Create One",
      },
      { status: 404 }
    );
  }

  try {
    // Wait for all email promises to resolve
    await Promise.all(emailPromises);

    // Update the mail status for each candidate in the database
    const updatePromises = candidates.map((candidate) => {
      const personalizedSubject = replacePlaceholders(subject, candidate);
      // Get the current UTC time
      return db.candidateProfile.update({
        where: { id: candidate.id }, // Assuming candidate has an 'id'
        data: {
          mailSent: "Yes",
          mailSentDate: new Date(), // Set the current date and time when email was sent
          mailSubject: personalizedSubject,
          mailTemplateName: templateName,
          mailSender: userName, // Name of the person sending the email
        },
      });
    });

    // Wait for all candidate updates to complete
    await Promise.all(updatePromises);
    // Create a candidate journey for each candidate after email is sent
    const journeyPromises = candidates.map((candidate) => {
      return createCandidateJourney(
        candidate.id,
        consultantData.id,
        user.name,
        templateName
      ); // Call your function to create a candidate journey
    });

    // Wait for all journey creation promises to resolve
    await Promise.all(journeyPromises);

    return new Response(
      JSON.stringify({
        message: "Bulk emails sent and journeys created successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    return new Response(
      JSON.stringify({
        message: "Error sending bulk emails",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

function createCandidateJourney(
  candidateId,
  consultantId,
  consultantName,
  templateName
) {
  return db.candidateJourney.create({
    data: {
      candidateId, // Linking the journey to the new candidate profile
      eventType: "EMAIL_SENT", // Event type: Profile Created
      remarks: `Template ${templateName} was sent by ${consultantName}.`,
      consultantId,
      createdAt: new Date(), // Current timestamp
    },
  });
}

import createTransporter from "@/lib/email"; // Import the transporter function

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
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: candidate.email, // Recipient address
      subject: `${subject}`, // Subject line
      html: `${content}`, // HTML body
    };

    return transporter.sendMail(mailOptions);
  });

  try {
    // Wait for all email promises to resolve
    await Promise.all(emailPromises);
    return new Response(
      JSON.stringify({ message: "Bulk emails sent successfully!" }),
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

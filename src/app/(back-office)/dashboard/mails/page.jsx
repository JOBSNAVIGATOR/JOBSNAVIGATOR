"use client";
import EmailEditor from "@/components/backOffice/EmailEditor";
import { templates } from "@/data";
import React from "react";

export default function page() {
  const emailTemplates = templates;
  const sendEmail = (emailData) => {
    console.log("Email Subject:", emailData.subject);
    console.log("Email Content:", emailData.content);

    // Make an API call to send the email
    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Email sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Failed to send email.");
      });
  };
  return <EmailEditor templates={emailTemplates} onSend={sendEmail} />;
}

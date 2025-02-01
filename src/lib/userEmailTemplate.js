export function userEmailTemplate(name, description, linkText, redirectUrl) {
  return `
   <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            background-color: #ffffff;
            color: #24292e;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 480px;
            margin: 0 auto;
            padding: 20px 0 48px;
        }
        .title {
            font-size: 24px;
            line-height: 1.25;
            text-align: center;
        }
        .section {
            padding: 24px;
            border: solid 1px #dedede;
            border-radius: 5px;
            text-align: center;
        }
        .text {
            margin: 0 0 10px 0;
            text-align: left;
        }
        .button {
            display: inline-block;
            font-size: 14px;
            background-color: #28a745;
            color: #fff;
            line-height: 1.5;
            border-radius: 0.5em;
            padding: 12px 24px;
            text-decoration: none;
        }
        .footer {
            color: #6a737d;
            font-size: 12px;
            text-align: center;
            margin-top: 60px;
        }
    </style>
</head>
  <body>
    <div class="container">
        <h2 class="title">${linkText}</h2>
        <div class="section">
            <p class="text">Hey <strong>${name}</strong>!</p>
            <p class="text">
                ${description}
            </p>
            <a class="button" href="${process.env.NEXT_PUBLIC_BASE_URL}/${redirectUrl}">${linkText}</a>
        </div>
        <p class="footer">Auth System By UJJWAL JINDAL ・ INDIA ・</p>
    </div>
  </body>
  </html>
    `;
}

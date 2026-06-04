export const MailTemplate = {
    Subject: {
        OTP: `OTP Code - APP_NAME`,
        REGISTRATION: `Registration Confirmation - APP_NAME`,
        ORDER: `Order Confirmation - ORDER_ID - APP_NAME`
    },
    TextBody: {
        OTP: `Dear USER_NAME,

Thank you for choosing APP_NAME! Here is your One-Time Password (OTP).

Your OTP code is: OTP_CODE

This code will expire in OTP_EXPIRY_MINUTES minutes. Please do not share this code with anyone.

If you did not request this code, please ignore this email.

Best regards,
The APP_NAME Team`,
        REGISTRATION: `Thank you for registering for an account with APP_NAME.

Click the link below to verify your email address:
VERIFICATION_URL

This link will expire in VERIFICATION_EXPIRY_HOURS hours.

Thank you,
APP_NAME`,

        ORDER: ``
    },
    HtmlBody: {
        OTP: `
<!DOCTYPE html>
<html>
<head>
<title>One-Time Password (OTP)</title>
</head>
<body>
<p>Dear USER_NAME,</p>
<p>Thank you for choosing APP_NAME! Here is your One-Time Password (OTP).</p>
<p><strong>Your OTP code is: OTP_CODE</strong></p>
<p>This code will expire in OTP_EXPIRY_MINUTES minutes. Please do not share this code with anyone.</p>
<p>If you did not request this code, please ignore this email.</p>
<p>Best regards,<br>The APP_NAME Team</p>
</body>
</html>
        `,
        REGISTRATION: ``,
        ORDER: ``
    }
}
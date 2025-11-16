const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");

let transporter;
if (process.env.EMAIL_HOST === "smtp.ethereal.email") {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

exports.sendVerificationEmail = async (email, userId, pin) => {
    try {
        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: "5m" } 
        );

        const verificationURL = `${process.env.BASE_URL}/auth/verify?token=${token}&pin=${pin}`;

        // אם אנחנו ב-Render או לא רוצים לשלוח מייל אמיתי
        if (process.env.RENDER === "true") {
            console.log("=== SIMULATED EMAIL (RENDER MODE) ===");
            console.log("To:", email);
            console.log("Verification URL:", verificationURL);
            console.log("=====================================");
            return { simulated: true };
        }

        // לוקאלית – שולחים אימייל אמיתי עם Ethereal
        const mailOptions = {
            from: `"Bank System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Account Verification Required',
            html: `
                <h2>Thank you for registering!</h2>
                <p>Please click the button below to activate. This link is valid for 5 minutes.</p>
                <a href="${verificationURL}"
                   style="padding:10px 20px;color:white;background:#007bff;text-decoration:none;border-radius:5px;">
                   Activate Account
                </a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.messageId);

        if (process.env.EMAIL_HOST === "smtp.ethereal.email") {
            console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
        }

        return info;

    } catch (error) {
        console.error("ERROR DETAILS:", error);
        return { error: true, message: "Failed to send email (app continues running)" };
    }
};

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendVerificationEmail = async (email, verificationURL) => {
    try {
        const mailOptions = {
            from: `"Bank System" <${process.env.EMAIL_USER}>'`,
            to: email,
            subject: 'Account Verification Required',
            html: `
                <h2>Thank you for registering!</h2>
                <p>Please click the button below to activate. This link is valid for 5 minutes. </p>
                <a href = "${verificationURL}"
                    style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                   Activate Account
                </a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);

        if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
            console.log("--- Ethereal Preview URL (CRITICAL) ---");
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); 
            console.log("--- END Preview URL ---");
        }

        return info;

    } catch (error) {
        console.error("Error sending verification email:", email);
        throw new Error("Failed to send verification email.");
    }
};
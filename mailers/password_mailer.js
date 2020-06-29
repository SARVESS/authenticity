const nodeMailer = require('../config/nodemailer');

require('dotenv').config();

// this is another way of exporting a method
exports.forgotMail = ( User, Reset_Link) => {
    let htmlString = nodeMailer.renderTemplate({ user: User, reset_link: Reset_Link }, '/password_reset.ejs');
    mailer.transporter.sendMail({
        from: process.env.Email,
        to: user.email,
        subject: "Reset Password",
        html: htmlString
    }, (err, info) => {
        if (err) {
            console.log("problem insending mail", err);
            return;
        }
        console.log("Mail sent", info);
        return;
    })
}
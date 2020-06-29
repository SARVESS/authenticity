const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// require dotenv to change variables
require('dotenv').config();

// transporter for nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    source: false,
    auth: {
        user: process.env.Email,
        pass: process.env.Password
    }
});

// render template for mailer
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){console.log('error in rendering template' , err); return;}
 
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}
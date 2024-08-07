const sendEmail = require('./sendEmail')
const sendVerificationEmail = async ({
    name,
    email,
    verificationToken,
    origin
}) => {
    const message = `<p>this is the verification token ${verificationToken} use this to verify your email</p> 
    `;
    return sendEmail({
        to: email,
        subject: 'Email Confirmation',
        html: `<h4> Hello, ${name}</h4>
        ${message}
        `,
    });
}
module.exports = sendVerificationEmail;
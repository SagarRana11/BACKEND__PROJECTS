const sendEmail = require('./sendEmail')
const sendForgotPasswordEmail = ({ name, email, passwordToken, origin }) => {
    const message = `<p>this is the password token ${passwordToken} use this to verify email</p>
    `;

    return sendEmail({
        to: email,
        subject: 'Password Reset',
        html: `<h4>Hello ${name}</h4> ${message}`,
    })
}

module.exports = sendForgotPasswordEmail
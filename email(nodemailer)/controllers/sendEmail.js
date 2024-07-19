const nodemailer = require("nodemailer");

const sendEmailEtheral = async(req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "ophelia.king@ethereal.email",
            pass: "SX8sYQZmPewWg7HKtd",
        },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'ranasagar974@gmail.com', // sender address
            to: "ranasagar97411@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        res.json(info)

    }

    main().catch(console.error);


}
module.exports = sendEmailEtheral
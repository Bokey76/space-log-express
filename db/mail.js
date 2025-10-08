const nodemailer = require('nodemailer');
const config = require("config");
const mailConfig = config.get('mail')
let transporter = nodemailer.createTransport({
    service: 'qq', // qq邮箱
	port: 465,
	secure: true, 
	auth: {
		user: mailConfig.user, //开启SMTP的邮箱，发件人
        pass: mailConfig.pass, // qq邮箱授权码
	}
})
module.exports = transporter;
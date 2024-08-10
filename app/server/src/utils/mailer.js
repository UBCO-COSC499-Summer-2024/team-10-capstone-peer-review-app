import nodemailer from "nodemailer";

const sendEmail = async (to, subject, htmlContent) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	let info = await transporter.sendMail({
		from: "PeerGrade",
		to: to,
		subject: subject,
		html: htmlContent
	});

	console.log("Message sent: %s", info.messageId);
};

export default sendEmail;

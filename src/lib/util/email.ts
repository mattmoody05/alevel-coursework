import {
	NODEMAILER_HOST,
	NODEMAILER_PASSWORD,
	NODEMAILER_PORT,
	NODEMAILER_USERNAME
} from '$env/static/private';
import { createTransport } from 'nodemailer';

export class Mailer {
	#email: string;

	constructor(email: string) {
		this.#email = email;
	}

	// Used to send an email to the specified email address
	// Uses NodeMailer to send the email
	sendEmail(options: { subject: string; htmlBody: string }) {
		const transporter = createTransport({
			host: NODEMAILER_HOST,
			port: Number(NODEMAILER_PORT),
			auth: {
				user: NODEMAILER_USERNAME,
				pass: NODEMAILER_PASSWORD
			}
		});
		transporter.sendMail({
			to: this.#email,
			subject: options.subject,
			html: options.htmlBody
		});
	}
}

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

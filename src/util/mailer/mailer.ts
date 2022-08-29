import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const OAuth2_client = new google.auth.OAuth2(
    process.env.GCP_CLIENT_ID,
    process.env.GCP_CLIENT_PW,
);
OAuth2_client.setCredentials({ refresh_token: process.env.GCP_REFRESH_TOKEN });

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        type: 'OAuth2',
        user: 'looknote.official@befferent.co.kr',
        clientId: process.env.GCP_CLIENT_ID,
        clientSecret: process.env.GCP_CLIENT_PW,
        refreshToken: process.env.GCP_REFRESH_TOKEN,
    },
});
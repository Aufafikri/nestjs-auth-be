import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class MailsService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  private generateTokenVerification (userId: string) {
    const payload = {
        userId
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    return token
  }

  public async sendVerificationEmail(email: string, userId: string) {
    const verificationToken = this.generateTokenVerification(userId)
    const verificationLink = `http://localhost:5000/auth/verify-email?token=${verificationToken}`

    try {
      await this.transporter.sendMail({
        to: email,
        subject: 'Welcome! Please Verify Your Email Address!',
        html: `
        <div style="border: 2px solid gray; padding: 20px; border-radius: 10px;">
            <h1>👋 Welcome to EvstStore!</h1>
            <p style="font-weight: bold;" >To complete your registration, please verify your email address by clicking the link below:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
            Verifiy Email
            </a>
            <p>Thanks for registration on my ecommerce application! 😊</p>
            </div>
        `
      })
    } catch (error) {
      console.error('failed to send email', error)
      throw new Error('Failed to send verification email');
    }
  }
}

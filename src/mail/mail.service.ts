import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // или другой сервис
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendJobRequestNotification(data: {
    workType: string;
    workDescription: string;
    email: string;
    phoneNumber: string;
    workDate: string;
    workTime: string;
  }) {
    const mailOptions = {
      from: `"Job Requests" <${process.env.MAIL_USER}>`,
      to: `${process.env.ADMIN_EMAIL}, ${process.env.ADMIN_EMAIL2}`,
      subject: `Новая заявка: ${data.workType}`,
      html: `
        <h3>Новая заявка</h3>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Телефон:</strong> ${data.phoneNumber}</p>
        <p><strong>Дата:</strong> ${data.workDate}</p>
        <p><strong>Время:</strong> ${data.workTime}</p>
        <p><strong>Тип работы:</strong> ${data.workType}</p>
        <p><strong>Описание работы:</strong> ${data.workDescription}</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

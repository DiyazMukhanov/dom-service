import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

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

  async sendEmailCode(email: string, fullName: string, code: string) {
    const html = `
    <p>Здравствуйте, ${fullName}!</p>
    <p>Ваш код подтверждения:</p>
    <h2>${code}</h2>
    <p>Сообщите его администратору.</p>
  `;

    return this.transporter.sendMail({
      from: `"Service Doma" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Код подтверждения email',
      html,
    });
  }

  async sendJobRequestToWorker(options: {
    email: string;
    fullName: string;
    jobRequestId: number;
    workDate: string;
    workTime: string;
    occupationTitle: string;
    categoryTitle: string;
    cityName: string;
    baseUrl?: string;
    workerId: number;
    address: string;
    price: number;
  }) {
    const {
      email,
      fullName,
      jobRequestId,
      workDate,
      workTime,
      occupationTitle,
      categoryTitle,
      cityName,
      workerId,
      address,
      price,
      baseUrl = 'https://service-doma.kz',
    } = options;

    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(workDate));

    const bookingLink = `${baseUrl}/job-requests/book/${jobRequestId}?workerId=${workerId}`;

    const html = `
    <p>Здравствуйте, ${fullName}!</p>
    <p>Появилась новая заявка:</p>
    <ul>
    <li><strong>Город:</strong> ${cityName}</li>
    <li><strong>Адрес:</strong> ${address}</li>
    <li><strong>Специалист:</strong> ${occupationTitle}</li>
     <li><strong>Работа:</strong> ${categoryTitle}</li>
      <li><strong>Дата:</strong> ${formattedDate}</li>
      <li><strong>Время:</strong> ${workTime}</li>
      <li><strong>💵 Оплата:</strong> ${price.toLocaleString('ru-RU')} ₸</li>
    </ul>
    <p><a href="${bookingLink}">Нажмите здесь, чтобы принять заявку</a></p>
  `;

    return this.transporter.sendMail({
      from: `"Service Doma" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Новая заявка #${jobRequestId}`,
      html,
    });
  }

  async sendClientWaitingEmail(options: {
    email: string;
    name: string;
    workDate: string;
    workTime: string;
    categoryTitle: string;
    cityName: string;
    address: string;
  }) {
    const {
      email,
      name,
      workDate,
      workTime,
      categoryTitle,
      cityName,
      address,
    } = options;

    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(workDate));

    const html = `
    <p>Здравствуйте, ${name}!</p>
    <p>Спасибо за вашу заявку на услугу <strong>${categoryTitle}</strong> в городе <strong>${cityName}</strong>.</p>
    <p>Мы уже ищем специалиста для вас!</p>
    <ul>
      <li><strong>Дата:</strong> ${formattedDate}</li>
      <li><strong>Время:</strong> ${workTime}</li>
      <li><strong>Адрес:</strong> ${address}</li>
    </ul>
    <p>Пожалуйста, оставайтесь на связи — скоро мы пришлём контакт исполнителя.</p>
  `;

    return this.transporter.sendMail({
      from: `"Service Doma" <${process.env.MAIL_USER}>`,
      to: email,
      subject: '🔍 Мы уже ищем специалиста!',
      html,
    });
  }

  async sendBookingInfoToClient(options: {
    email: string;
    fullName: string;
    workerName: string;
    workerPhone: string;
    workDate: string;
    workTime: string;
    occupationTitle: string;
    categoryTitle: string;
    address: string;
  }) {
    const {
      email,
      fullName,
      workerName,
      workerPhone,
      workDate,
      workTime,
      occupationTitle,
      categoryTitle,
      address,
    } = options;

    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(workDate));

    const html = `
    <p>Здравствуйте, ${fullName}!</p>
    <p>Ваша заявка успешно принята.</p>
    <p><strong>Исполнитель:</strong> ${workerName}</p>
    <p><strong>Телефон исполнителя:</strong> ${workerPhone}</p>
    <ul>
      <li><strong>Услуга:</strong> ${categoryTitle}</li>
      <li><strong>Специализация:</strong> ${occupationTitle}</li>
      <li><strong>Адрес:</strong> ${address}</li>
      <li><strong>Дата:</strong> ${formattedDate}</li>
      <li><strong>Время:</strong> ${workTime}</li>
    </ul>
    <p>Ожидайте звонка от исполнителя.</p>
  `;

    return this.transporter.sendMail({
      from: `"Service Doma" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `🔔 Ваша заявка принята!`,
      html,
    });
  }

  async sendJobTakenNotification(options: {
    email: string;
    fullName: string;
    jobRequestId: number;
  }) {
    const { email, fullName, jobRequestId } = options;

    const html = `
    <p>Здравствуйте, ${fullName}!</p>
    <p>К сожалению, заявка №${jobRequestId} уже была забронирована другим работником.</p>
    <p>Пожалуйста, ожидайте новые заявки — они появятся скоро.</p>
  `;

    return this.transporter.sendMail({
      from: `"Service Doma" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Заявка №${jobRequestId} уже занята`,
      html,
    });
  }

  async sendBookingConfirmationToWorker(options: {
    email: string;
    fullName: string;
    occupationTitle: string;
    categoryTitle: string;
    address: string;
    workDate: string;
    workTime: string;
    clientPhone: string;
    price: number;
  }) {
    const {
      email,
      fullName,
      occupationTitle,
      categoryTitle,
      address,
      workDate,
      workTime,
      clientPhone,
      price,
    } = options;

    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(workDate));

    const formattedPrice = price.toLocaleString('ru-RU');

    const html = `
    <p>Здравствуйте, ${fullName}!</p>
    <p>Вы успешно забронировали заявку:</p>
    <ul>
      <li><strong>Специалист:</strong> ${occupationTitle}</li>
      <li><strong>Работа:</strong> ${categoryTitle}</li>
      <li><strong>Адрес:</strong> ${address}</li>
      <li><strong>Дата:</strong> ${formattedDate}</li>
      <li><strong>Время:</strong> ${workTime}</li>
      <li><strong>Клиент:</strong> ${clientPhone}</li>
      <li><strong>💵 Оплата:</strong> ${formattedPrice} ₸</li>
    </ul>
  `;

    return this.transporter.sendMail({
      from: `"Service Doma" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `✅ Вы приняли заявку`,
      html,
    });
  }
}

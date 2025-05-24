import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  constructor(private readonly configService: ConfigService) {}

  async sendSms(to: string, message: string): Promise<void> {
    const login = this.configService.get<string>('SMSCENTER_LOGIN');
    const password = this.configService.get<string>('SMSCENTER_PASSWORD');

    const params = {
      login: login,
      psw: password,
      phones: to,
      mes: message,
      fmt: 3, // JSON-ответ
      charset: 'utf-8',
    };

    try {
      const response = await axios.get('https://smsc.kz/sys/send.php', {
        params,
      });
      console.log('SMS sent:', response.data);
    } catch (error) {
      console.error('SMS send error:', error.response?.data || error.message);
    }
  }
}

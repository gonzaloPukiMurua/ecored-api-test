/* eslint-disable prettier/prettier */
// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendRegistrationMail(email: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: '¡Bienvenido a EcoRed!',
      template: './registration', // src/mail/templates/registration.hbs
      context: { name },
    });
  }

  async sendRequestCreatedMail(email: string, listingTitle: string, requesterName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Nueva solicitud recibida',
      template: './request-created',
      context: { listingTitle, requesterName },
    });
  }

  async sendRequestStatusChangedMail(requesterEmail: string, publisherEmail: string, listingName: string, newStatus: string): Promise<void> {
    await this.mailerService.sendMail({
      to: [requesterEmail, publisherEmail],
      subject: 'Actualización de tu solicitud',
      template: './request-status-changed',
      context: { listingName, newStatus },
    });
  }

  async sendDeliveryConfirmationMail(email: string, listingTitle: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Entrega confirmada',
      template: './delivery-confirmed',
      context: { listingTitle },
    });
  }
}


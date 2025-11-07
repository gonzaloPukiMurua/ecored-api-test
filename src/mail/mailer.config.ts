/* eslint-disable prettier/prettier */
import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { existsSync } from 'fs';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

export const mailerConfig = async (configService: ConfigService): Promise<MailerOptions> => {
  // Si el proyecto está compilado, las plantillas estarán en dist/
  const distTemplatesDir = join(__dirname, 'templates');
  const srcTemplatesDir = join(process.cwd(), 'src/mail/templates');

  // Detectar automáticamente si existe dist o src
  const templatesDir = existsSync(distTemplatesDir) ? distTemplatesDir : srcTemplatesDir;

  return {
    transport: {
      host: configService.get<string>('MAIL_HOST'),
      port: configService.get<number>('MAIL_PORT'),
      secure: false, // true si usas SSL (por ejemplo, puerto 465)
      auth: {
        user: configService.get<string>('MAIL_USER'),
        pass: configService.get<string>('MAIL_PASS'),
      },
    },
    defaults: {
      from: `"EcoRed" <${configService.get<string>('MAIL_FROM')}>`,
    },
    template: {
      dir: templatesDir,
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};


import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { DatabaseCheckModule } from './database-check/database-check.module';

export const { ObserveModule, ObserveInstrument } =
  createObserveModule();

@Module({
  imports: [
    // Chargement des variables d'environnement (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Supervision de l'application
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'back-end',
    }),

    // Connexion Prisma / PostgreSQL
    PrismaModule,

    // Vérification de la base de données
    DatabaseCheckModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CollectionsModule } from './collections/collections.module';
import { PrismaModule } from './prisma/prisma.module';
import { StreamModule } from './stream/stream.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot(),
    PrismaModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        CLIENT_BASEURL: Joi.string().required(),
        POSTGRES_PRISMA_URL: Joi.string().required(),
        AUTHSCH_HOST: Joi.string().uri().required(),
        AUTHSCH_CLIENT_ID: Joi.string().required(),
        AUTHSCH_CLIENT_SECRET: Joi.string().required(),
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

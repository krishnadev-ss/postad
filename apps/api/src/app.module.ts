import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import configuration from './config/configuration';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { AdSpacesModule } from './modules/adspaces/adspaces.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AdminModule } from './modules/admin/admin.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProvidersModule,
    AdSpacesModule,
    BookingsModule,
    ActivitiesModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

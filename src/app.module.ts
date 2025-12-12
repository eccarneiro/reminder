import { Module } from '@nestjs/common';
import { ChannelsModule } from './modules/channels/channels.module';
import { EventsModule } from './modules/events/events.module';
import { DevicesModule } from './modules/devices/devices.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ChannelsModule, 
    EventsModule, 
    DevicesModule, 
    SubscriptionsModule, 
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

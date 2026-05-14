import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaModule } from '../prisma/prisma.module'; // زدنا هادي

@Module({
  imports: [PrismaModule], // وزدنا هادي
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
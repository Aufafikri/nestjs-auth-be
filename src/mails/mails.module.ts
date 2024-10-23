import { Global, Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';

@Global()
@Module({
  controllers: [MailsController],
  providers: [MailsService],
  exports: [MailsService]
})
export class MailsModule {}

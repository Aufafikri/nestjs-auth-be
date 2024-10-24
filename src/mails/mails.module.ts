import { Global, Module } from '@nestjs/common';
import { MailsService } from './mails.service';

@Global()
@Module({
  providers: [MailsService],
  exports: [MailsService]
})
export class MailsModule {}

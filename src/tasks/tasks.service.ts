// url.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UrlCreateService } from '../url-shortening/services/url-create.service';

@Injectable()
export class TasksService {
  constructor(private readonly urlCreateService: UrlCreateService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleExpiredUrls() {
    this.urlCreateService.deleteExpiredUrls();
  }
}

import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('available-date')
  getAvailableDate(@Query('timezone') timezone: string) {
    return this.appService.getAvailableDate(timezone);
  }

  @Post('/order/:userId/:date')
  orderTable(@Param('userId') userId: string, @Param('date') date: string) {
    return this.appService.orderTable(userId, date);
  }
}

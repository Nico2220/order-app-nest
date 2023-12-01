import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dayjs from 'dayjs';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('available-date', () => {
    const obj = {
      message: `the available dates start from :  ${dayjs().format()}`,
      availableDate: dayjs().format(),
    };
    it('should return a object {message:string, availableDate:string}', () => {
      expect(appController.getAvailableDate()).toMatchObject(obj);
    });
  });

  describe('Order', () => {
    const table = {
      id: '1',
      orders: [],
    };
    it('should return 404 if user not found}', () => {
      expect(
        appController.orderTable('1', '2023-12-01T07:32:45+03:00'),
      ).toBeTruthy();
    });
  });
});

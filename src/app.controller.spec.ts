import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dayjs from 'dayjs';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getAvailableDate: jest.fn(() => ({
      message: `the available dates start from :  ${dayjs().format()}`,
      availableDate: dayjs().format(),
    })),

    orderTable: jest.fn((userId, date) => ({
      id: '1',
      orders: [{ users: [userId], orderDate: date }],
    })),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(AppService)
      .useValue(mockAppService)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('available-date', () => {
    const obj = {
      message: expect.any(String),
      availableDate: expect.any(String),
    };
    it('should return a object {message:string, availableDate:string}', () => {
      expect(appController.getAvailableDate()).toEqual(obj);
    });
  });

  describe('Order', () => {
    const table = {
      id: expect.any(String),
      orders: expect.any(Array),
    };

    it('should return the table  when a user orders}', () => {
      expect(
        appController.orderTable('1', '2023-12-01T07:00:45+03:00'),
      ).toEqual(table);

      expect(mockAppService.orderTable).toHaveBeenCalledWith(
        '1',
        '2023-12-01T07:00:45+03:00',
      );
    });
  });
});

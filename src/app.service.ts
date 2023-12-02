import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { time } from 'console';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type User = {
  id: string;
  name: string;
  timezone: string;
};

const users: User[] = [
  { id: '1', name: 'Jon Doe', timezone: 'Europe/Berlin' },
  { id: '2', name: 'Tim Ali', timezone: 'Europe/Moscow' },
  { id: '3', name: 'Tom Eric', timezone: 'America/Toronto' },
];

type Order = {
  users: string[];
  orderDate: string | dayjs.Dayjs;
};

type Table = {
  id: string;
  orders: Order[];
};

const table: Table = {
  id: '1',
  orders: [] as Order[],
};

@Injectable()
export class AppService {
  getAvailableDate(timezone: string) {
    const lastOrder = table.orders[table.orders.length - 1];
    const lastOrderDate = lastOrder && dayjs(lastOrder.orderDate).tz(timezone);
    if (lastOrderDate == null) {
      let now = dayjs().tz(timezone);
      const min = now.minute();
      if (min > 0) {
        now = now.add(60 - min, 'minute');
      }
      return {
        message: `the available dates start from :  ${now.format(
          'DD-MM-YYYY HH:00',
        )}`,
        availableDate: now.format(),
      };
    }

    if (lastOrder.users.length === 2) {
      const nextDate = lastOrderDate.add(3, 'hour').format();
      return {
        message: `The table is full, the available dates start from nowwwww ${nextDate}`,
        availableDate: nextDate,
      };
    }

    if (lastOrder.users.length === 1) {
      return {
        message: `there is one sit left on this table, you can order from ${lastOrderDate.format()}`,
        availableDate: lastOrderDate.format(),
      };
    }
  }

  orderTable(userId: string, dateString: string) {
    const lastOrder = table.orders[table.orders.length - 1];
    const date = dateString ? dayjs(dateString) : dayjs();
    const user = this.getUserById(userId);

    if (date.minute() > 0) {
      throw new BadRequestException('Error Date format');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (lastOrder && lastOrder.users.length === 1) {
      if (lastOrder.users.includes(userId)) {
        throw new BadRequestException("You can't sit on both seats");
      }

      lastOrder.users.push(userId);
      return table;
    }

    if (lastOrder && lastOrder.users.length === 2) {
      const diff = date.diff(lastOrder.orderDate, 'hour');
      const nextDate = dayjs(lastOrder.orderDate).add(3, 'hour').format();
      if (diff < 3) {
        throw new BadRequestException(
          `You cannot order for this time, the next available date start from : ${nextDate}`,
        );
      }
    }

    const order = {
      users: [userId],
      orderDate: date.tz(user.timezone).format(),
    };
    table.orders.push(order);
    return table;
  }

  getUserById(id: string) {
    const user = users.find((user) => user.id === id);
    return user;
  }
}

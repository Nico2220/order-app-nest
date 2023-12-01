import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';

type User = {
  id: string;
  name: string;
};

const users: User[] = [
  { id: '1', name: 'Jon Doe' },
  { id: '2', name: 'Tim' },
  { id: '3', name: 'Tom' },
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
  getHello(): string {
    return 'Hello World!';
  }

  getAvailableDate() {
    const lastOrder = table.orders[table.orders.length - 1];
    const lastOrderDate = lastOrder && dayjs(lastOrder.orderDate);
    if (lastOrderDate == null) {
      return {
        message: `the available dates start from :  ${dayjs().format()}`,
        availableDate: dayjs().format(),
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
        availableDate: lastOrderDate.format('YYYY-MM-DD HH:mm'),
      };
    }
  }

  orderTable(userId: string, dateString: string) {
    const lastOrder = table.orders[table.orders.length - 1];
    const date = dateString ? dayjs(dateString) : dayjs();
    if (!this.getUserById(userId)) {
      throw new NotFoundException('User not found');
    }
    if (lastOrder && lastOrder.users.length === 1) {
      if (lastOrder.users.includes(userId)) {
        throw new BadRequestException("You can't sit on both seats");
        // return res.status(400).json({ error: "You can't sit on both seats" });
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
      orderDate: date.format(),
    };
    table.orders.push(order);
    return table;
  }

  getUserById(id: string) {
    const user = users.find((user) => user.id === id);
    return user;
  }
}

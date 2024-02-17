import { Answer } from '../entities/answer';
import { Order, OrderStatus } from '../entities/order';
import { Service } from '../entities/service';
import { User } from '../entities/user';
import { ApiError } from '../exceptions/ApiError';
import { Database } from '../loaders/db';
import { CreateOrderRequest } from '../types/app';
const { getEm } = Database;

export async function getOrders(status: OrderStatus = 'PENDING') {
  const em = await getEm();
  return await em.find(
    Order,
    { status },
    {
      populate: ['answers', 'answers.question'],
      exclude: ['createdBy', 'answers.order'],
    }
  );
}

export async function createOrder(
  request: CreateOrderRequest,
  currentUser: User
): Promise<Partial<Order>> {
  const em = await getEm();
  const service = (await em.findOneOrFail(
    Service,
    {
      id: request.serviceId,
    },
    { populate: ['questions'] }
  )) as Service;
  const order = new Order();
  order.service = service;

  order.answers.add(toAnswers(request, order));
  order.createdBy = currentUser;

  await em.persistAndFlush(order);
  em.clear();
  return (await getOrderById(order.id)) as Partial<Order>;
}

export async function getOrderById(id: string) {
  const em = await getEm();
  return (await em.findOneOrFail(
    Order,
    { id },
    {
      populate: ['answers', 'answers.question'],
      exclude: ['createdBy', 'answers.question'],
    }
  )) as unknown as Order;
}

function toAnswers(request: CreateOrderRequest, order: Order) {
  return order.service.questions.map((question) => {
    if (question.required && request[question.id] == undefined) {
      throw new ApiError(
        ApiError.BAD_REQUEST,
        'All mandatory questions must be answered'
      );
    }
    const answer = new Answer();
    answer.question = question;
    answer.answer = request[question.id] ?? '';
    answer.order = order;
    return answer;
  });
}

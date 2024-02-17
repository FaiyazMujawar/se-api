import { Request } from 'express';
import { Answer } from '../entities/answer';
import { Order, OrderStatus } from '../entities/order';
import { Service } from '../entities/service';
import { ApiError } from '../exceptions/ApiError';
import { Database } from '../loaders/db';
import { uploadFile } from './upload';
import { UploadedFile } from 'express-fileupload';
import { Question } from '../entities/question';
import { Collection } from '@mikro-orm/core';
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

export async function createOrder(request: Request): Promise<Partial<Order>> {
  const em = await getEm();
  const service = (await em.findOneOrFail(
    Service,
    {
      id: request.body.serviceId,
    },
    { populate: ['questions'] }
  )) as Service;
  const order = new Order();
  order.service = service;

  order.answers.add(await toAnswers(request, order));
  order.createdBy = request.user;

  await em.persistAndFlush(order);
  em.clear();
  return (await getOrderById(order.id)) as Partial<Order>;
}

export async function getOrderById(id: string) {
  const em = await getEm();
  return ((await em.findOneOrFail(
    Order,
    { id },
    {
      populate: ['answers', 'answers.question'],
      exclude: ['createdBy', 'answers.order'],
    }
  )) as unknown) as Order;
}

async function toAnswers(request: Request, order: Order) {
  const answers: Answer[] = [];

  if (!hasAllRequiredDetails(request, order.service.questions)) {
    throw new ApiError(
      ApiError.BAD_REQUEST,
      'All required details must be provided'
    );
  }

  for (let i = 0; i < order.service.questions.length; i++) {
    const question = order.service.questions[i];
    const answer = new Answer();
    answer.question = question;
    answer.order = order;
    if (question.type === 'TEXT') {
      answer.answer = request.body[question.id];
    } else {
      const file = request.files[question.id] as UploadedFile;
      const uri = await uploadFile(file);
      answer.answer = file.name;
      answer.filepath = uri;
    }
    answers.push(answer);
  }
  return answers;
}

function hasAllRequiredDetails(
  request: Request,
  questions: Collection<Question>
) {
  return !questions.exists(
    (question) =>
      question.required &&
      request[question.type === 'TEXT' ? 'body' : 'files'][question.id] ===
        undefined
  );
}

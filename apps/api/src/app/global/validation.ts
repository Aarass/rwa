import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Provider,
} from '@nestjs/common';
import { createUserSchema } from '@rwa/shared';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export async function validateData(objectData: any, objectDto: any) {
  const dataObject = plainToInstance(objectDto, objectData);
  const errors = await validate(dataObject);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints))
      .join('; ');
    throw new BadRequestException(errorMessages);
  }
}

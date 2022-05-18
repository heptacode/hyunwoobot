import { createError } from '@/modules/createError';

export async function err(error: Error) {
  createError('ClientError', `[${error.name}] ${error.message}`);
}

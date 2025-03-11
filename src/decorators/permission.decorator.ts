import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permission';
export const Permission = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

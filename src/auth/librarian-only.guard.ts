import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LibrarianOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const user: User = context.switchToHttp().getRequest().user;
    if (!user.isLibrarian) {
      throw new ForbiddenException('you must be a librarian');
    }
    return true;
  }
}

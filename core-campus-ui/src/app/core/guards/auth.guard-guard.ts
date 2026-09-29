import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { User } from '../models/campus.models';

export const authGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const currentUser = storage.get<User>('CURRENT_USER');

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole = route.data?.['role'];
  if (expectedRole && currentUser.role !== expectedRole) {
    router.navigate([currentUser.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard']);
    return false;
  }

  return true;
};
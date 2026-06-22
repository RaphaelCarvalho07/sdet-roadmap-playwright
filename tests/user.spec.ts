import { test, expect } from '@playwright/test';
import { UserClient } from '../src/api/UserClient';
import { IApiUser } from '../src/types/user.types';

test('should validate API User contract', async ({ request }) => {
  // Initialize our API Client
  const userClient = new UserClient(request);

  // Act: Call the service instead of making a raw HTTP request
  const response = await userClient.getUsers(2);

  // Assert
  expect(response.ok()).toBeTruthy();
  
  const resBody: IApiUser = await response.json();
  expect(resBody.data[0].id).toBe(7);
  expect(typeof resBody.data[0].email).toBe('string');
});
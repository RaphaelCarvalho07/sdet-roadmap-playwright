import { test, expect } from '@playwright/test';
import { UserClient } from '../src/api/UserClient';
import { IApiUser } from '../src/types/user.types';

let userClient: UserClient;

test.beforeEach(async ({ request }) => {
  userClient = new UserClient(request);
});

test.describe('ReqRes API - User Management', () => {

  test('should validate API User contract and data integrity', async () => {
    const response = await userClient.getUsers(2);

    expect(response.ok()).toBeTruthy();
    
    const resBody: IApiUser = await response.json();

    // 1. Validate pagination logic instead of fixed numbers
    expect(resBody.page).toBe(2);
    expect(resBody.data.length).toBeGreaterThan(0);

    // 2. Extract the first user dynamically
    const firstUser = resBody.data[0];

    // 3. Smart Assertions: Validate rules, not hardcoded strings
    expect(firstUser.id).toBeDefined();
    expect(typeof firstUser.id).toBe('number');
    expect(firstUser.id).toBeGreaterThan(0);

    expect(firstUser.email).toContain('@');
    expect(firstUser.first_name.length).toBeGreaterThan(0);
    
    // Validate that the avatar URL is properly formed
    expect(firstUser.avatar).toBeDefined();
    expect(firstUser.avatar.startsWith('https://')).toBeTruthy();
  });

  test('should return status 200 when fetching users page 1', async () => {
    const response = await userClient.getUsers(1);
    expect(response.status()).toBe(200);
  });

});
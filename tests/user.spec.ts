import { test, expect } from '@playwright/test';
import { UserClient } from '../src/api/UserClient';
import { IApiUser } from '../src/types/user.types';

// 1. Declare the variable at the file level so all tests can access it
let userClient: UserClient;

// 2. Setup hook to initialize the client before each test execution
test.beforeEach(async ({ request }) => {
  userClient = new UserClient(request);
});

// 3. Your test suite blocks
test.describe('ReqRes API - User Management', () => {

  test('should validate API User contract', async () => {
    // Act: Notice we don't instantiate the client anymore, it's already done!
    const response = await userClient.getUsers(2);

    // Assert
    expect(response.ok()).toBeTruthy();
    
    const resBody: IApiUser = await response.json();
    expect(resBody.data[0].id).toBe(7);
    expect(typeof resBody.data[0].email).toBe('string');
  });

  // 💡 Example of a second test reusing the same client instance effortlessly
  test('should return status 200 when fetching users page 1', async () => {
    const response = await userClient.getUsers(1);
    expect(response.status()).toBe(200);
  });

});
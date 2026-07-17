import { test, expect } from "@playwright/test";
import { UserClient } from "../../src/api/UserClient";
import { IApiUser } from "../../src/types/user.types";
import { UserFactory } from "../../src/factories/userFactory";
import {
  apiUserResponseSchema,
  createUserResponseSchema,
} from "../../src/schemas/user.schema";

let userClient: UserClient;

test.beforeEach(async ({ request }) => {
  userClient = new UserClient(request);
});

test.describe("reqres API - User Management", () => {
  test("should validate API User contract and data integrity", async () => {
    // Action
    const response = await userClient.getUsers(2);

    // Assert
    expect(response.ok()).toBeTruthy();

    const resBody: IApiUser = await response.json();

    // 1. Validate pagination logic instead of fixed numbers
    expect(resBody.page).toBe(2);
    expect(resBody.data.length).toBeGreaterThan(0);

    apiUserResponseSchema.parse(resBody);
  });

  test("should return status 200 when fetching users page 1", async () => {
    const response = await userClient.getUsers(1);
    expect(response.status()).toBe(200);
  });

  test("should sucessfully create an user with dynamic factory data", async () => {
    // Arrange
    const dynamicUserPayload = await UserFactory.createValidUserPayload();

    // Action
    const response = await userClient.createUser(dynamicUserPayload);
    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    // Assert
    createUserResponseSchema.parse(responseBody);

    expect(responseBody.name).toBe(dynamicUserPayload.name);
    expect(responseBody.job).toBe(dynamicUserPayload.job);
  });
});

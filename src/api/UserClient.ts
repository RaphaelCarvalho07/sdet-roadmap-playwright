import { APIRequestContext } from "@playwright/test";
import { UserPayload } from "../types/user.types";

export class UserClient {
  private request: APIRequestContext;
  private apiKey: string;

  constructor(request: APIRequestContext) {
    const apiKey = process.env.REQRES_API_KEY;

    if (!apiKey) {
      throw new Error("Missing environment variable: REQRES_API_KEY");
    }

    this.request = request;
    this.apiKey = apiKey;
  }

  /**
   * Fetches a paginated list of users
   * @param pageNumber The page number to retrieve
   */
  async getUsers(pageNumber: number) {
    return await this.request.get('/api/users', {
      params: {
        page: pageNumber,
      },
      headers: {
        "x-api-key": this.apiKey,
      },
    });
  }

  /**
   * Create an user dynamically
   * @param payload The payload used to create a new user dynamically.
   */
  async createUser(payload: UserPayload) {
    return await this.request.post('/api/users', {
      data: payload,
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json"
      }
    });
  }
}

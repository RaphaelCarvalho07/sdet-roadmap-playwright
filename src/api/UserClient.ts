import { APIRequestContext } from '@playwright/test';

export class UserClient {
  private request: APIRequestContext;
  private baseUrl: string;
  private apiKey: string;

  constructor(request: APIRequestContext) {
    const baseUrl = process.env.BASE_URL;
    const apiKey = process.env.REQRES_API_KEY;

    if (!baseUrl || !apiKey) {
      throw new Error('Missing environment variables: BASE_URL or REQRES_API_KEY');
    }

    this.request = request;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Fetches a paginated list of users
   * @param pageNumber The page number to retrieve
   */
  async getUsers(pageNumber: number) {
    return await this.request.get(`${this.baseUrl}/api/users`, {
      params: {
        page: pageNumber
      },
      headers: {
        'x-api-key': this.apiKey
      }
    });
  }
}
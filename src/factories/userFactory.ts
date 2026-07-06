import { UserPayload } from '../types/user.types';

export class UserFactory {
  static async createValidUserPayload(): Promise <UserPayload> {
    const { faker } = await import('@faker-js/faker');
    return {
        name: faker.person.fullName(),
        job: faker.person.jobTitle()
    }
  }
}

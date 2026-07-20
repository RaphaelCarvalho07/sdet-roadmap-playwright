import {
  JuiceUserRegistrationPayload,
  JuiceUserLoginPayload,
} from "../types/user.types";

export class UserFactory {
  /**
   * Generates a valid dynamic payload for Juice Shop User Registration
   */
  static async createValidJuiceUserPayload(): Promise<JuiceUserRegistrationPayload> {
    const { faker } = await import("@faker-js/faker");
    const password = `Pass_${faker.string.alphanumeric(8)}`;
    return {
      email: faker.internet.email({ provider: "sdet-test.com" }).toLowerCase(),
      password: password,
      repeatPassword: password,
      securityQuestion: {
        id: 1,
        question: "Your eldest sibling's middle name?",
      },
      securityAnswer: faker.person.middleName(),
    };
  }

  /**
   * Creates a Juice Shop Login payload for a known email and password
   */
  static createJuiceLoginPayload(
    email: string,
    password: string,
  ): JuiceUserLoginPayload {
    return {
      email,
      password,
    };
  }
}

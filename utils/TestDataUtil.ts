export class TestDataUtil {

  static generateEmail() {
    return `user${Date.now()}@test.com`;
  }

  static generateName(prefix: string) {
    return `${prefix}_${Date.now()}`;
  }

}
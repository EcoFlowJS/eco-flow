export class EnvBuilder {
  static generateSystemEnv(ENV: { [key: string]: string }) {}

  static updateSystemEnv(ENV: { [key: string]: string }) {}

  static getSystemEnvNameList(): string[] {
    return [];
  }

  static generateUserEnv(path: string, ENV: { [key: string]: string }) {}

  static getUserEnvs(path: string): any {}

  static getUserEnvNameList(path: string): string[] {
    return [];
  }

  static setUserEnv(path: string, value: { [key: string]: string }): void {}

  static setUserEnvFromTemplate(
    path: string,
    template: string,
    value: { [key: string]: string }
  ): void {}
}

export class LogLevel {
  constructor() {}
  static get ERROR(): number {
    return 0;
  }
  static get WARNING(): number {
    return 1;
  }
  static get INFO(): number {
    return 2;
  }
  static get VERBOSE(): number {
    return 4;
  }
  static get DEBUG(): number {
    return 5;
  }
}

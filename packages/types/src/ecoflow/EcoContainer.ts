export interface IEcoContainer {
  register<T, U extends string>(name: U, resolver: T): IEcoContainer;
  get<T = any>(name: string, args?: unknown): T;
}

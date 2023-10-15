export interface EcoContainer {
  register<T, U extends string>(name: U, resolver: T): EcoContainer;
  get<T = any>(name: string, args?: unknown): T;
}

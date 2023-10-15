import { EcoContainer as IEcoContainer } from "@eco-flow/types";

export default class EcoContainer implements IEcoContainer {
  registered = new Map<string, unknown>();
  resolved = new Map();

  register<T, U extends string>(name: U, resolver: T): EcoContainer {
    if (this.registered.has(name)) {
      throw new Error(`Cannot register already registered service ${name}`);
    }

    this.registered.set(name, resolver);
    return this;
  }

  get(name: string, args?: unknown) {
    if (this.resolved.has(name)) return this.resolved.get(name);

    if (this.registered.has(name)) {
      const resolver = this.registered.get(name);
      if (typeof resolver === "function")
        this.resolved.set(name, new (resolver as any)({ ecoFlow }, args));
      else this.resolved.set(name, resolver);
      return this.resolved.get(name);
    }

    return undefined;
  }
}

import { EcoContainer as IEcoContainer } from "@ecoflow/types";

/**
 * Represents an EcoContainer class that implements the EcoContainer interface.
 */
export default class EcoContainer implements IEcoContainer {
  registered = new Map<string, unknown>();
  resolved = new Map();

  /**
   * Registers a service with a given name and resolver function in the EcoContainer.
   * @param {U} name - The name of the service to register.
   * @param {T} resolver - The resolver function for the service.
   * @returns {EcoContainer} - The EcoContainer instance with the service registered.
   * @throws {Error} - If a service with the same name is already registered.
   */
  register<T, U extends string>(name: U, resolver: T): EcoContainer {
    if (this.registered.has(name)) {
      throw new Error(`Cannot register already registered service ${name}`);
    }

    this.registered.set(name, resolver);
    return this;
  }

  /**
   * Retrieves a value by name from the resolver.
   * If the value is already resolved, it returns the resolved value.
   * If the value is registered but not resolved, it resolves it using the registered resolver.
   * @param {string} name - The name of the value to retrieve.
   * @param {unknown} args - Optional arguments to pass to the resolver.
   * @returns The resolved value corresponding to the name, or undefined if not found.
   */
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

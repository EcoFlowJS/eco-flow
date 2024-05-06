/**
 * Interface for an EcoContainer that allows registering and resolving dependencies.
 */
export interface EcoContainer {
  /**
   * Registers a service with a given name and resolver function in the EcoContainer.
   * @param {U} name - The name of the service to register.
   * @param {T} resolver - The resolver function for the service.
   * @returns {EcoContainer} - The EcoContainer instance with the service registered.
   * @throws {Error} - If a service with the same name is already registered.
   */
  register<T, U extends string>(name: U, resolver: T): EcoContainer;

  /**
   * Retrieves a value by name from the resolver.
   * If the value is already resolved, it returns the resolved value.
   * If the value is registered but not resolved, it resolves it using the registered resolver.
   * @param {string} name - The name of the value to retrieve.
   * @param {unknown} args - Optional arguments to pass to the resolver.
   * @returns The resolved value corresponding to the name, or undefined if not found.
   */
  get<T = any>(name: string, args?: unknown): T;
}

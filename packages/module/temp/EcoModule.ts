import { EcoModule as IEcoModule } from "@eco-flow/types";
import _ from "lodash";
import { SearchResults, searchPackages } from "query-registry";

export class EcoModule implements IEcoModule {
  /**
   * list all modules in the package registry.
   * @returns {Promise<SearchResults>} Promise of search results for all available modules in the PackageRegistry.
   */
  get listAvailablePackages(): Promise<SearchResults> {
    return new Promise<SearchResults>((resolve, reject) => {
      searchPackages({
        query: {
          text: ModuleEntryPoint,
        },
      })
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }
}

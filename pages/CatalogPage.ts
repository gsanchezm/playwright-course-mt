import { BasePage } from "./BasePage";

export class CatalogPage extends BasePage {
  searchPizza(name: string): this {
    return this.step(() => this.tid("search-pizza").fill(name));
  }
}

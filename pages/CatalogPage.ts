import { expect, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CatalogPage extends BasePage {
    private get pizzaCards(): Locator {
        return this.page.locator("[data-testid^='pizza-card-']");
    }

    waitForCatalog(): this {
        return this.step(async () => {
            await this.page.waitForURL(/\/catalog/);
            await expect(this.pizzaCards.first()).toBeVisible();
        });
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/catalog/);
        await expect(this.pizzaCards.first()).toBeVisible();
    }

    async expectHasPizzas(minimum = 1): Promise<void> {
        await expect(this.pizzaCards.first()).toBeVisible();
        expect(await this.pizzaCards.count()).toBeGreaterThanOrEqual(minimum);
    }

    async getPizzaNames(): Promise<string[]> {
        const names = await this.pizzaCards.getByRole("heading", { level: 3 }).allTextContents();
        return names.map((name) => name.trim()).filter(Boolean);
    }
}

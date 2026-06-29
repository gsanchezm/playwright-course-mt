import { expect, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MenuPage extends BasePage{
    logout(): this {
         return this.step(() => this.page.getByTestId("logout-btn").click());
    }
    
    async getCartCount(): Promise<string> {
        const b = this.page.getByTestId("nav-cart-count");
        return (await b.count()) ? (await b.innerText()).trim() : "0";
    }

    async expectCartCount(n: number): Promise<void> {
        await expect(this.page.getByTestId("nav-cart-count")).toHaveText(String(n));
    }
}
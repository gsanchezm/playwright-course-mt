import { expect, type Locator } from '@playwright/test';
import { BasePage } from "./BasePage";
import type { CountryCode, User } from "../types";

export class LoginPage extends BasePage {
    readonly path = "/";

    // --------------- Locators (test ids) --------------------------------
    // String locator: el locator es un string (test id)
    private txtUsername: string = "username";
    private txtPassword: string = "password";
    private btnMarket: string = "market-";
    private btnSignIn: string = "login-button";

    // También se puede con getters que devuelven el Locator
    private get usernameInput(): Locator {
        return this.tid(this.txtUsername);
    }

    private get passwordInput(): Locator {
        return this.tid(this.txtPassword);
    }

    private marketButton(code: CountryCode): Locator {
        return this.page.getByTestId(`${this.btnMarket}${code}`);
    }

    private get signInButton(): Locator {
        return this.tid(this.btnSignIn);
    }

    //-------------------------- Actions -------------------------------------------------------
    async navigateTo(): Promise<void> {
        await this.page.goto(this.path);
    }

    async selectMarket(code: CountryCode): Promise<void> {
        await this.marketButton(code).click();
    }

    // Combinamos las 2 formas (typeInput y getters) para asegurarnos de que ambas funcionan
    async loginAs(user: User, code?: CountryCode): Promise<void> {
        await this.typeInput(this.txtUsername, user.username);
        await this.typeInput(this.txtPassword, user.password);

        if (code) {
            await this.selectMarket(code);
        }

        await this.signInButton.click();

        await this.waitForUrl(/\/catalog/);
    }

    async loginAsUser(user: User): Promise<void> {
        await this.usernameInput.clear();
        await this.usernameInput.fill(user.username);

        await this.passwordInput.clear();
        await this.passwordInput.fill(user.password);

        await this.signInButton.click();
    }

    async loginInMarket(user: User, code: CountryCode): Promise<void> {
        await this.navigateTo();
        await this.selectMarket(code);
        await this.loginAsUser(user);
        await this.waitForUrl(/\/catalog/);
    }

    //------------------------ Assertions -------------------------------
    async expectedLoaded(): Promise<void> {
        await expect(this.signInButton).toBeVisible();
    }

    async expectUrlContains(urlPattern: RegExp): Promise<void> {
        await expect(this.page).toHaveURL(urlPattern);
    }
}

import { expect, type Locator } from '@playwright/test';
import { BasePage } from "./BasePage";
import { CountryCode, User } from "../types";

export class LoginPage extends BasePage{
    readonly path="/";

    // --------------- Arrange --------------------------------------------
    //String locator
    // Se puede con esta forma, donde el locator es un string
    private txtUsername:string = "username";
    private txtPassword: string = "password"
    private btnMarket: string = "market-"
    private btnSignIn:string = "login-button"

    // Se puede esta forma usando getters y setter
    private get usernameInput(): Locator{
        return this.tid(this.txtUsername);
    }

    private get passwordInput(): Locator{
        return this.tid(this.txtPassword);
    }

    private marketButton(code: CountryCode): Locator{
        return this.page.getByTestId(`${this.btnMarket}${code}`);
    }

    private get signInButton(): Locator{
        return this.tid(this.btnSignIn);
    }

    //-------------------------- Actions -------------------------------------------------------
    async navigateTo(): Promise<void>{
        await this.page.goto(this.path);
    }

    async selectMarket(code: CountryCode): Promise<void>{
        await this.marketButton(code).click();
    }

    // para los siguientes métodos usamos las 2 combinaciones asegurandonos que las 2 funcionan
    async loginAs(user: User, code: CountryCode): Promise<void>{
        await this.typeInput(this.txtUsername, user.username);
        await this.typeInput(this.txtPassword, user.password);
        //await this.tid(this.btnSignIn).click();

        await this.selectMarket(code);
        await this.signInButton.click();

        await this.waitForUrl(/\/catalog/);
    }

    async loginAsUser(user: User, code: CountryCode): Promise<void>{
        await this.usernameInput.clear();
        await this.usernameInput.fill(user.username);

        await this.passwordInput.clear();
        await this.passwordInput.fill(user.password);

        await this.selectMarket(code);
        await this.signInButton.click();
    }

    //------------------------ Assertions -------------------------------
    async expectedLoaded(): Promise<void>{
        await expect(this.signInButton).toBeVisible();
    }

    async expectUrlContains(urlPattern: RegExp): Promise<void>{
        await expect(this.page).toHaveURL(urlPattern);
    }
}
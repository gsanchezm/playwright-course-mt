import { test } from "@playwright/test";
import { LoginPage, CatalogPage } from '../pages';
import type { Market, User } from "../types/";
import marketJson from "../data/markets.json" with {type: "json"};
import usersJson from "../data/users.json" with {type: "json"};

const markets = marketJson as Market[];
const users = usersJson as User[];

const standardUser = users.find((u) => u.username === "standard_user");

// Guard clause
if (!standardUser) {
    throw new Error("data/users.json doesn't include a username called standard_user");
}

test.describe("POM - Fluent Interface", () => {
    test("Fluent", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage
        .navigateTo()
        .loginIn(standardUser.username)
        .withPassword(standardUser.password)
        .login();

        await loginPage.expectUrlContains(/\/catalog/);
    });
});

test.describe("POM - Login per market", () => {
    for (const market of markets) {
        // String Interpolation
        test(`TC-${market.code} - logitn + catalog in market ${market.code}`, { tag: "@smoke" }, async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.navigateTo();
            await loginPage.loginAs(standardUser, market.code);
            await loginPage.expectUrlContains(/\/catalog/);
        });
    }
});


test.describe("POM — login + catálogo por mercado (M03)", () => {
  for (const market of markets) {
    test(`TC-${market.code} — flow limpio en ${market.fullName} @smoke`, async ({ page }) => {
      // El spec ahora se lee como user story, no como instrucción técnica.
      const loginPage = new LoginPage(page);
      const catalogPage = new CatalogPage(page);

      await loginPage.loginInMarket(standardUser, market.code);
      await catalogPage.expectLoaded();
      await catalogPage.expectHasPizzas();
    });
  }
});

test.describe("POM — uso de acciones granulares", () => {
  test("demostración de API del POM @smoke", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);

    await loginPage.goto();
    await loginPage.selectMarket("MX");
    await loginPage.loginAs(standardUser);

    await catalogPage.waitForCatalog();
    const names = await catalogPage.getPizzaNames();
    console.log(`Pizzas en MX: ${names.length}`);
  });
});

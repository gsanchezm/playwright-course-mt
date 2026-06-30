import { test as base, expect } from "@playwright/test";
import { LoginPage, CatalogPage, CheckoutPage, MenuPage } from "../pages";
import type { Market, User } from "../types";
import marketJson from "../data/markets.json" with {type: "json"};
import usersJson from "../data/users.json" with {type: "json"};

const markets = marketJson as Market[];
const users = usersJson as User[];

type PageFixtures = {
    loginPage: LoginPage;
    catalogPage: CatalogPage;
    checkoutPage: CheckoutPage;
    standarUser: User;
}

type WorkerFixtures = {
    defaultMarket: Market;
}

export const test = base.extend<PageFixtures, WorkerFixtures>({
    defaultMarket: [async ({ }, use) => {
        const mx = markets.find((m) => m.code === "MX");
        if (!mx) throw new Error("MX market not found");
        await use(mx);
    }, { scope: "worker" }],

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

});

export {expect};
export type { Market, User};
import { test as setup, expect, request } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const AUTH_DIR = ".auth";
const USER_FILE = path.join(AUTH_DIR, "user.json"); //-> .auth/user.json

const API_URL = process.env.API_URL ?? "https://omnipizza-backend.onrender.com";
const BASE_URL = process.env.BASE_URL ?? "https://omnipizza-frontend.onrender.com";
const USERNAME = process.env.TEST_USER_USERNAME ?? "standard_user";
const PASSWORD = process.env.TEST_USER_PASSWORD ?? "pizza123";

setup.describe.configure({ mode: "serial" });

setup.beforeAll(() => {
    if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
    }
});

setup("wake up backend (warm cold start)", async ({ request }) => {
    setup.setTimeout(90_000);
    const res = await request.get(`${API_URL}/health`, { timeout: 80_000 });
    expect(res.ok(), "backend /health should be 200").toBeTruthy();
});

const COUNTRY = process.env.DEFAULT_COUNTRY ?? "US";

const MARKETS: Record<string, { language: string; locale: string, currency: string }> = {
    MX: { language: "es", locale: "es-MX", currency: "MXN" },
    US: { language: "en", locale: "es-US", currency: "USD" },
}

function decodeJwt(token: string): { sub?: string; behavior?: string } {
    const payload = token.split(".")[1] ?? "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(normalized, "base64").toString("utf-8");
    return JSON.parse(json);
}

setup("authenticate as standard_user", async ({ browser, request }) => {
    const apiRes = await request.post(`${API_URL}/api/auth/login`, {
        data: {
            "username": USERNAME,
            "password": PASSWORD
        }
    });
    expect(apiRes.ok(), `login API should be 200, Status: ${apiRes.status()}`).toBeTruthy();
    const {access_token} = (await apiRes.json()) as {access_token: string};
    expect(access_token, "Token must exist").toBeTruthy();

    const claims = decodeJwt(access_token);
    const username = claims.sub ?? USERNAME;
    const behavior = claims.behavior ?? "standard";
    const market = MARKETS[COUNTRY] ?? MARKETS.US;

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(BASE_URL);
    
    await page.evaluate(
        ([token, user, beh, countryCode, mkt]) =>{
            const {language, locale, currency} = mkt as  {
                language: string;
                locale: string;
                currency: string;
            };

            window.localStorage.setItem(
                "omnipizza-auth",
                JSON.stringify({state: {token, username: user, behavior: beh}, version:0})
            );

            window.localStorage.setItem(
                "omnipizza-country",
                JSON.stringify({state: {countryCode, countryInfo: null, language, locale, currency}, version:0})
            );

            window.localStorage.setItem("token", token as string);
            window.localStorage.setItem("username", user as string);
            window.localStorage.setItem("countryCode", countryCode as string);
        },
        [access_token, username, behavior, COUNTRY, market] as const,
    );

    await context.storageState({path: USER_FILE});
    await context.close();

});


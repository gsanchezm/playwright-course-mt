import { test, expect } from "@playwright/test";
import { AuthService } from "../services";
import type { Market, User } from "../types";
import marketJson from "../data/markets.json" with {type: "json"};
import usersJson from "../data/users.json" with {type: "json"};

const markets = marketJson as Market[];
const users = usersJson as User[];
const standardUser = users.find((u) => u.username === "standard_user");
const API_URL = process.env.API_URL ?? "https://omnipizza-backend.onrender.com"

// Guard clause
if (!standardUser) {
    throw new Error("data/users.json doesn't include a username called standard_user");
}

test.describe("API demo layer", {tag:"@api"}, ()=>{
    test("Complete API flow: auth -> list pizzas per market", async () =>{
        const auth = await AuthService.create(API_URL);
        const { access_token } = await auth.login(standardUser);
        console.log(access_token.toString());
        await auth.dispose();
    });
})


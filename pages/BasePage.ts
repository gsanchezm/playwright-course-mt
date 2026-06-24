import { Page, Locator } from "@playwright/test";

export class BasePage{
    protected chain: Promise<unknown> = Promise.resolve();
    constructor(protected readonly page: Page, seedChain?:Promise<unknown>){};

    protected tid(base: string): Locator {
        const size = this.page.viewportSize();
        const suffix = size && size.width < 768 ? "-responsive" : "-desktop";
        return this.page.getByTestId(`${base}${suffix}`).or(this.page.getByTestId(base)).first();
    }

    protected waitForUrl(pattern: RegExp, timeout = 15_000): this {
        return this.step(async () =>{
            await this.page.waitForURL(pattern, {timeout});
        })
    }

    screenshot(name: string): this{
        return this.step(() => this.page.screenshot({ path: `test-results/${name}.png`}))
    }

    // Dont Repeat Yourself - DRY
    protected typeInput(locator: string, text: string): this {
        return this.step(async () =>{
            
            await this.tid(locator).clear();
            await this.tid(locator).fill(text);
        })
        
    }

    protected step(action: ()=> Promise<unknown>): this{
        this.chain = this.chain.then(() => action());
        return this;
    }

    then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value:void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ):Promise<TResult1 | TResult2>{
        return this.chain.then<void>(() => undefined).then(onfulfilled, onrejected);
    }



}

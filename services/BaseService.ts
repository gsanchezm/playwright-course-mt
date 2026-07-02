import { APIRequestContext } from "@playwright/test";

export abstract class BaseService{
    protected constructor(protected readonly api: APIRequestContext, protected readonly baseURL: string){}

    protected abstract basePath():string;

    protected url(path = ""){
        return `${this.baseURL}${this.basePath()}${path}`
    }

    async dispose(): Promise<void>{
        await this.api.dispose();
    }
}

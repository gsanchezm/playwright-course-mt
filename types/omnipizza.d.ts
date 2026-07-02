export type CountryCode = "MX" | "US" | "CH" | "JP";
export type Currency = "MXN" | "USD" | "CHF" | "JPY";

export interface User{
    username: string;
    password: string;
    role?: string;
    description?: string;
}

export interface Market{
    code: CountryCode;
    currency: Currency;
    fullName: string;
    phone: string;
    address: string;
    colonia?: string;
    zipCode: string;
    taxRate?: number;
}

export interface LoginResponse{
    access_token: string;
    token_type?: string;
    username?: string;
    behavior?:string;
}
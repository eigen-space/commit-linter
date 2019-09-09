export interface Config {
    issuePrefixes?: string[];
    extends?: string;
    ignore?: string[];
    body?: RegExp;
}

export interface Dictionary {
    [property: string]: string | Dictionary | string[];
}

export interface Config {
    issuePrefixes?: string[];
    extends?: string;
    linkToRule?: string;
    ignore?: string[];
    body?: RegExp;
}

export interface Dictionary {
    [property: string]: string | Dictionary | string[];
}

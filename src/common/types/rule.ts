import { TokenDictionary } from './token-dictionary';
import { Config } from './config';

export type Rule = (config: Config, tokens: TokenDictionary) => void;
import { i18n, InitOptions, TFunction } from 'i18next';
import { MultiReplaceMatcher } from '@simplyhexagonal/multi-replace';
export default class I18N {
    static version: string;
    private static instance;
    private _logfn;
    private static stringifyAndAlert;
    private _generateReplacer;
    initPromise: Promise<TFunction>;
    t: TFunction | null;
    matchers: MultiReplaceMatcher[];
    replacer: (match: string, p0: string) => string;
    i18next: i18n;
    changeLanguage: i18n['changeLanguage'];
    plugins: {
        esbuild: {
            name: string;
            setup(build: any): void;
        };
        vite: {
            name: string;
            transform: (code: string) => Promise<{
                code: string;
                map: null;
            }>;
            transformIndexHtml: (html: string) => Promise<string>;
        };
    };
    constructor(options: InitOptions, matchers?: MultiReplaceMatcher[]);
    apply: (originalContents: string) => string;
}

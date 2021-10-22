import { i18n, InitOptions, TFunction } from 'i18next';
import { MultiReplaceMatcher } from '@simplyhexagonal/multi-replace';
export default class I18N {
    static version: string;
    private static instance;
    private static stringifyAndAlert;
    private _generateReplacer;
    initPromise: Promise<TFunction>;
    t: TFunction | null;
    matchers: MultiReplaceMatcher[];
    replacer: (match: string, p0: string) => string;
    i18next: i18n;
    changeLanguage: i18n['changeLanguage'];
    plugin: {
        name: string;
        setup(build: any): void;
    };
    constructor(options: InitOptions, matchers?: MultiReplaceMatcher[]);
    apply: (originalContents: string) => string;
}

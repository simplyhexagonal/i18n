import fs from 'fs';
import i18next, {
  i18n,
  InitOptions,
  TFunction
} from 'i18next';
import {
  MultiReplaceMatcher,
  MultiReplaceSyncPatterns,
  multiReplaceSync,
} from '@simplyhexagonal/multi-replace';

export default class I18N {
  private static instance: I18N;

  private static stringifyAndAlert = (value: any) => {
    console.log(`
    🟡 Missing translation for: ${value}
    `);
    return JSON.stringify(value);
  };

  private _generateReplacer = (t: TFunction) => {
    return (match: string, p0: string) => {
      return t(p0);
    }
  };

  // @ts-ignore
  initPromise: Promise<TFunction>;

  t: TFunction | null = null;

  matchers: MultiReplaceMatcher[] = [/__\(\s*['"`](.+?)['"`]\s*\)/g];

  replacer: (
    match: string,
    p0: string,
  ) => string = (
    match: string,
    p0: string,
  ) => {
    console.log(`
    🟡 I18N WARNING: replacer called but is not ready! Did you forget to await initPromise?
    `);

    return p0;
  };

  i18next: i18n = i18next;

  changeLanguage: i18n['changeLanguage'] = i18next.changeLanguage.bind(i18next);

  plugin = {
    name: 'i18n',
    setup(build: any) {
      const loadPatterns: [RegExp, 'js' | 'jsx' | 'ts' | 'tsx'][] = [
        [/\.tsx$/, 'tsx'],
        [/\.ts$/, 'ts'],
        [/\.jsx$/, 'jsx'],
        [/\.js$/, 'js'],
      ];
      loadPatterns.forEach(([filter, loader]) => {
        build.onLoad({ filter }, async (args: any) => {
          await I18N.instance.initPromise;

          const originalContents = fs.readFileSync(args.path, 'utf8');
          const contents = I18N.instance.apply(originalContents);

          return {
            contents,
            loader,
          }
        });
      });
    }
  };

  constructor(options: InitOptions, matchers?: MultiReplaceMatcher[]) {
    if (I18N.instance) {
      console.log(`
      🟡 I18N WARNING: already initialized! Returning existing instance...
      `);

      return I18N.instance;
    }

    this.initPromise = i18next.use({
      type: 'postProcessor',
      name: 'warnMissingTranslation',
      process: (value: any, key: any, options: any, translator: any) => {
        if (value === key) {
          I18N.stringifyAndAlert(value);
        }

        return value;
      }
    }).init(options).then((t) => {
      this.t = t;

      this.replacer = this._generateReplacer(t);

      return t;
    });

    if (matchers) {
      this.matchers = matchers;
    }

    I18N.instance = this;
  }

  apply = (originalContents: string) => {
    const replacePatterns: MultiReplaceSyncPatterns = this.matchers.map(
      (m) => [m, this.replacer]
    );

    return multiReplaceSync(originalContents, replacePatterns);
  };
}

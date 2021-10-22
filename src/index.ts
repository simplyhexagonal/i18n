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
import MonoContext from '@simplyhexagonal/mono-context';

// @ts-ignore
import { version } from '../package.json';

export default class I18N {
  static version = version;

  private static instance: I18N;
  private _logfn: (
    (...args: any[]) => void
  ) | (
    (...args: any[]) => Promise<void>
  ) = (...args) => console.log('\n\t🟡 ', ...args, '\n');

  private static stringifyAndAlert = (value: any) => {
    const {language} = I18N.instance.i18next;

    I18N.instance._logfn(`I18N WARNING: Missing "${language}" translation for: ${value}`);

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
    I18N.instance._logfn(
      'I18N WARNING: replacer called but is not ready! Did you forget to await initPromise?'
    );

    return p0;
  };

  i18next: i18n = i18next;

  changeLanguage: i18n['changeLanguage'] = i18next.changeLanguage.bind(i18next);

  plugins = {
    esbuild: {
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
      },
    },
    vite: {
      name: 'i18n',
      transform: async (code: string) => {
        await I18N.instance.initPromise;

        return {
          code: I18N.instance.apply(code),
          map: null,
        };
      },
      transformIndexHtml: async (html: string) => {
        await I18N.instance.initPromise;
        return I18N.instance.apply(html);
      },
    }
  };

  constructor(options: InitOptions, matchers?: MultiReplaceMatcher[]) {
    const callCount = MonoContext.count('I18N');
    if (callCount > 1) {
      I18N.instance._logfn('I18N WARNING: already initialized! Returning existing instance...');

      return I18N.instance;
    }

    this.initPromise = i18next.use({
      type: 'postProcessor',
      name: 'warnMissingTranslation',
      process: (value: any, key: any, options: any, translator: any) => {
        if ([value].flat().join('') === [key].flat().join('')) {
          I18N.stringifyAndAlert(value);
        }

        return value;
      }
    }).init({
      ...options,
      postProcess: [
        'warnMissingTranslation',
        ...(options.postProcess || []),
      ],
    }).then((t) => {
      this.t = t;

      this.replacer = this._generateReplacer(t);

      return t;
    });

    if (typeof (MonoContext.getStateValue('logger') || {}).warn === 'function') {
      this._logfn = MonoContext.getStateValue('logger').warn;
    }

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

import fs from 'fs';

import I18N from '../src';

import en from '../__fixtures__/en.json';
import es from '../__fixtures__/es.json';

class buildMock {
  static loadRules = [] as {filter: RegExp; fn: (args: any) => Promise<({contents: string; loader: string;})>}[];
  static onLoad = ({ filter }: any, fn: (args: any) => Promise<({contents: string; loader: string;})>) => {
    buildMock.loadRules.push({
      filter,
      fn,
    });
  };
  static load = async (path: string) => {
    const result = await buildMock.loadRules.reduce(async (a, {filter, fn}) => {
      await a;

      if (filter.test(path)) {
        return fn({path}).then((r) => r.contents);
      }

      return Promise.resolve(a);
    }, Promise.resolve(''));

    return result;
  }
}

const template = fs.readFileSync('./__fixtures__/template.html').toString();
const enResult = fs.readFileSync('./__fixtures__/expected.en.html').toString();
const esResult = fs.readFileSync('./__fixtures__/expected.es.html').toString();
const tsxResult = fs.readFileSync('./__fixtures__/expected.tsx').toString();

const i18n = new I18N({
  resources: {
    ...en,
    ...es,
  }
}, 
  [
    /\{\{([^\{\}]+?)\}\}/g,
    /__\(\s*['"`](.+?)['"`]\s*\)/g
  ]
);

describe('I18N internationalization class', () => {
  it('can process one language', async () => {
    await i18n.initPromise;

    await i18n.changeLanguage('en');

    const result = i18n.apply(template);

    expect(result).toBe(enResult);
  });

  it('can process another language', async () => {
    await i18n.initPromise;

    await i18n.changeLanguage('es');

    const result = i18n.apply(template);

    expect(result).toBe(esResult);
  });

  it('can be used as an esbuild plugin', async () => {
    await i18n.initPromise;

    await i18n.changeLanguage('en');

    i18n.plugin.setup(buildMock);

    const result = await buildMock.load('./__fixtures__/template.tsx');

    expect(result).toBe(tsxResult);
  });
});

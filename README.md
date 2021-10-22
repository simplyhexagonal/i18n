# Simply Hexagonal i18n
![Tests](https://github.com/simplyhexagonal/i18n/workflows/tests/badge.svg)

[i18next](https://www.npmjs.com/package/i18next) wrapper, compatible with esbuild for use as plugin
or stand-alone dependency.

## Open source notice

This project is open to updates by its users, [I](https://github.com/jeanlescure) ensure that PRs are relevant to the community.
In other words, if you find a bug or want a new feature, please help us by becoming one of the
[contributors](#contributors-) ✌️ ! See the [contributing section](#contributing)

## Like this module? ❤

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) ☕
- Supporting Simply Hexagonal on [Open Collective](https://opencollective.com/simplyhexagonal) 🏆
- Starring this repo on [Github](https://github.com/simplyhexagonal/i18n) 🌟

## Install

```sh
pnpm i -D

# or
yarn add -D

# or
npm install -D 
```

## Config

```ts
import I18N from '@simplyhexagonal/i18n';

import en from './i18n/en.json';
import es from './i18n/es.json';
// etc..

const i18n = new I18N({
  resources: {
    ...en,
    ...es,
    // etc...
  }
});
```

## Usage

With [esbuild](https://esbuild.github.io/):

```ts
await i18n.initPromise;

await i18n.changeLanguage('en');

const esbuildConfig: BuildOptions = {
  entryPoints: [/* ... */],
  outfile: '...',
  bundle: true,
  minify: isProduction,
  plugins: [
    i18n.plugin,
  ],
};

build(esbuildConfig);
```

With [Vite](https://vitejs.dev/):

```ts
await i18n.initPromise;

await i18n.changeLanguage('en');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        i18n.plugin,
      ],
    },
  },
})
```

Stand-alone:

```ts
await i18n.initPromise;

await i18n.changeLanguage('en');

const template = fs.readFileSync('./template.html').toString();

const result = i18n.apply(template);

// do something with result
```

## Template usage and configuration

In your templates use the `__('key')` notation:

```tsx
<h1>__('hello')</h1>
```

If you would like to change the notation, you can set your own custom regular exression to find the
i18n keys within your templates:

```ts
const i18n = new I18N(
  {
    resources: {
      ...en,
      ...es,
    },
  },
  [
    /\{\{([^\{\}]+?)\}\}/g,
  ],
);
```

The key is expected to always be the first matching group (i.e. whatever is matched within the
first set of parenthesis in your regex).

**NOTE:** _you can define multiple regexes._

Then in your template:

```tsx
<h1>{{hello}}</h1>
```
## Contributing

Yes, thank you! This plugin is community-driven, most of its features are from different authors.
Please update the docs and tests and add your name to the `package.json` file.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jeanlescure.cr"><img src="https://avatars2.githubusercontent.com/u/3330339?v=4" width="100px;" alt=""/><br /><sub><b>Jean Lescure</b></sub></a><br /><a href="#maintenance-jeanlescure" title="Maintenance">🚧</a> <a href="https://github.com/simplyhexagonal/i18n/commits?author=jeanlescure" title="Code">💻</a> <a href="#userTesting-jeanlescure" title="User Testing">📓</a> <a href="https://github.com/simplyhexagonal/i18n/commits?author=jeanlescure" title="Tests">⚠️</a> <a href="#example-jeanlescure" title="Examples">💡</a> <a href="https://github.com/simplyhexagonal/i18n/commits?author=jeanlescure" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
## License

Copyright (c) 2021-Present [Simply Hexagonal i18n Contributors](https://github.com/simplyhexagonal/i18n/#contributors-).<br/>
Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

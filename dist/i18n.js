var I18N = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var src_exports = {};
  __export(src_exports, {
    default: () => I18N
  });
  var import_fs = __toModule(require("fs"));
  var import_i18next = __toModule(require("i18next"));
  var import_multi_replace = __toModule(require("@simplyhexagonal/multi-replace"));
  var import_package = __toModule(require("../package.json"));
  const _I18N = class {
    constructor(options, matchers) {
      this._generateReplacer = (t) => {
        return (match, p0) => {
          return t(p0);
        };
      };
      this.t = null;
      this.matchers = [/__\(\s*['"`](.+?)['"`]\s*\)/g];
      this.replacer = (match, p0) => {
        console.log(`
    \u{1F7E1} I18N WARNING: replacer called but is not ready! Did you forget to await initPromise?
    `);
        return p0;
      };
      this.i18next = import_i18next.default;
      this.changeLanguage = import_i18next.default.changeLanguage.bind(import_i18next.default);
      this.plugin = {
        name: "i18n",
        setup(build) {
          const loadPatterns = [
            [/\.tsx$/, "tsx"],
            [/\.ts$/, "ts"],
            [/\.jsx$/, "jsx"],
            [/\.js$/, "js"]
          ];
          loadPatterns.forEach(([filter, loader]) => {
            build.onLoad({ filter }, async (args) => {
              await _I18N.instance.initPromise;
              const originalContents = import_fs.default.readFileSync(args.path, "utf8");
              const contents = _I18N.instance.apply(originalContents);
              return {
                contents,
                loader
              };
            });
          });
        }
      };
      this.apply = (originalContents) => {
        const replacePatterns = this.matchers.map((m) => [m, this.replacer]);
        return (0, import_multi_replace.multiReplaceSync)(originalContents, replacePatterns);
      };
      if (_I18N.instance) {
        console.log(`
      \u{1F7E1} I18N WARNING: already initialized! Returning existing instance...
      `);
        return _I18N.instance;
      }
      this.initPromise = import_i18next.default.use({
        type: "postProcessor",
        name: "warnMissingTranslation",
        process: (value, key, options2, translator) => {
          if (value === key) {
            _I18N.stringifyAndAlert(value);
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
      _I18N.instance = this;
    }
  };
  let I18N = _I18N;
  I18N.version = import_package.version;
  I18N.stringifyAndAlert = (value) => {
    console.log(`
    \u{1F7E1} Missing translation for: ${value}
    `);
    return JSON.stringify(value);
  };
  return src_exports;
})();
//# sourceMappingURL=i18n.js.map
'undefined'!=typeof module&&(module.exports=I18N.default),'undefined'!=typeof window&&(I18N=I18N.default);
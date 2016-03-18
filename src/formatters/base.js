export class BaseFormat {
  constructor(locales = 'en-US', options = {}, defaultOptions = {}) {
    const localeList = Array.isArray(locales) ? locales : [locales];

    this._resolvedOptions = Object.assign(defaultOptions, options);
    this._resolvedOptions.locale = localeList[0];
  }

  resolvedOptions() {
    return this._resolvedOptions;
  }
}

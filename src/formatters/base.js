export class BaseFormat {
  constructor(locales = 'en-US', options = {}, defaultOptions = {}) {
    const localeList = Array.isArray(locales) ? locales : [locales];


    const resolvedOptions = Object.assign(defaultOptions, options);

    this.__keys = ['locale'].concat(Object.keys(defaultOptions));

    this.__keys.forEach(key => {
      const recordName = key[0].toUpperCase() + key.slice(1);
      this[`[[${recordName}]]`] = resolvedOptions[key];
    });

    this['[[Locale]]'] = localeList[0];
  }

  resolvedOptions() {
    const options = {};
    this.__keys.forEach(key => {
      const recordName = key[0].toUpperCase() + key.slice(1);
      options[key] = this[`[[${recordName}]]`];
    });
    return options;
  }
}

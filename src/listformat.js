export class ListFormat {
  constructor(locales = 'en-US', options = {}) {
    const localeList = Array.isArray(locales) ? locales : [locales];

    this._resolvedOptions = Object.assign({
      locale: localeList[0],
      type: 'regular',
      style: 'long'
    }, options);
  }

  resolvedOptions() {
    return this._resolvedOptions;
  }

  format(list) {
    if (!Array.isArray(list)) {
      return Promise.resolve(list);
    }

    const length = list.length;

    if (length === 0) {
      return Promise.resolve('');
    }

    if (length === 1) {
      return Promise.resolve(list[0]);
    }

    const type = this._resolvedOptions.type;
    const style = this._resolvedOptions.style;

    if (type === 'unit' || type === 'number') {
      return document.l10n.formatValue(`listformat-${type}`).then(pattern => {
        let string = pattern.replace('{0}', list[0]).replace('{1}', list[1]);

        for (let i = 2; i < length; i++) {
          string = pattern.replace('{0}', string).replace('{1}', list[i]);
        }
        return string;
      });
    }

    const strid = `listformat-${type}-${style}`;

    if (length === 2) {
      return document.l10n.formatValue(`${strid}-2`).then(pattern => {
        return pattern.replace('{0}', list[0]).replace('{1}', list[1]);
      });
    }

    return document.l10n.formatValues(
      `${strid}-start`,
      `${strid}-middle`,
      `${strid}-end`).then(([start, middle, end]) => {

      let string = end
        .replace('{1}', list[length - 1])
        .replace('{0}', list[length - 2]);

      for (let i = length - 3; i >= 0; i--) {
        const template = i === 0 ? start : middle;

        string = template.replace(/\{([0-9])\}/g, (m, v) => {
          if (v === '0') {
            return list[i];
          }
          if (v === '1') {
            return string;
          }
        });
      }
      return string;
    });
  }

  formatToParts(list) {
  }
}

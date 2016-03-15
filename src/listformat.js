
function injectParts(parts, elem) {
  if (Array.isArray(elem)) {
    parts.push(...elem);
  } else {
    parts.push({type: 'element', value: elem});
  }
}

function pushParts(parts, list, pattern) {
  if (list.length > 2) {
    parts.push(...constructParts(list.slice(1), pattern));
  } else {
    injectParts(parts, list[1]);
  }
}

function constructParts(list, pattern) {
  let parts = [];

  if (list.length === 1) {
    return [{type: 'element', value: list[0]}];
  }

  let chunks = pattern.split(/\{[01]\}/);

  let ltr = pattern.indexOf('{0}') < pattern.indexOf('{1}');

  chunks.forEach((chunk, i) => {
    if (chunk) {
      parts.push({type: 'literal', value: chunk});
    }
    if (i === 0) {
      if (ltr) {
        injectParts(parts, list[0]);
      } else {
        pushParts(parts, list, pattern);
      }
    } else if (i === 1) {
      if (ltr) {
        pushParts(parts, list, pattern);
      } else {
        injectParts(parts, list[0]);
      }
    }
  });

  return parts;
}

function FormatToParts(type, style, list) {
  if (!Array.isArray(list)) {
    return Promise.resolve([
      {type: 'element', value: list}
    ]);
  }

  const length = list.length;

  if (length === 0) {
    return Promise.resolve([
      {type: 'element', value: ''}
    ]);
  }

  if (length === 1) {
    return Promise.resolve([
      {type: 'element', value: list[0]}
    ]);
  }

  if (type === 'unit' || type === 'number') {
    return document.l10n.formatValue(`listformat-${type}`).then(pattern => {
      return constructParts(list, pattern);
    });
  }

  const strid = `listformat-${type}-${style}`;

  if (length === 2) {
    return document.l10n.formatValue(`${strid}-2`).then(pattern => {
      return constructParts(list, pattern);
    });
  }

  return document.l10n.formatValues(
    `${strid}-start`,
    `${strid}-middle`,
    `${strid}-end`).then(([start, middle, end]) => {


    let parts = constructParts([
      list[0],
      constructParts(list.slice(1, -1), middle)
    ], start);

    parts = constructParts([
      parts, 
      list[list.length - 1]
    ], end);

    return parts;
  });
}

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
    const type = this._resolvedOptions.type;
    const style = this._resolvedOptions.style;
    return FormatToParts(type, style, list).then(parts => {
      return parts.reduce((string, part) => string + part.value, '');
    });
  }

  formatToParts(list) {
    return FormatToParts(type, style, list);
  }
}

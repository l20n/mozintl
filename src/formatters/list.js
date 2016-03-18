import { BaseFormat} from './base';
import { deconstructPattern } from '../utils';

export function constructParts(pattern, list) {
  if (list.length === 1) {
    return [{type: 'element', value: list[0]}];
  }

  let elem0 = typeof list[0] === 'string' ?
    {type: 'element', value: list[0]} : list[0];

  let elem1 = list.length === 2 ?
    (typeof list[1] === 'string') ?
      {type: 'element', value: list[1]} :
      list[1] :
    constructParts(pattern, list.slice(1));

  return deconstructPattern(pattern, {
    '0': elem0,
    '1': elem1
  });
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
      return constructParts(pattern, list);
    });
  }

  const strid = `listformat-${type}-${style}`;

  if (length === 2) {
    return document.l10n.formatValue(`${strid}-2`).then(pattern => {
      return constructParts(pattern, list);
    });
  }

  return document.l10n.formatValues(
    `${strid}-start`,
    `${strid}-middle`,
    `${strid}-end`).then(([start, middle, end]) => {

    let parts = constructParts(start, [
      list[0],
      constructParts(middle, list.slice(1, -1))
    ]);

    parts = constructParts(end, [
      parts, 
      list[list.length - 1]
    ]);

    return parts;
  });
}

export class ListFormat extends BaseFormat {
  constructor(locales, options) {
    super(locales, options, {
      type: 'regular',
      style: 'long'
    });
  }

  format(list) {
    const type = this._resolvedOptions.type;
    const style = this._resolvedOptions.style;
    return FormatToParts(type, style, list).then(parts => {
      return parts.reduce((string, part) => string + part.value, '');
    });
  }

  formatToParts(list) {
    const type = this._resolvedOptions.type;
    const style = this._resolvedOptions.style;
    return FormatToParts(type, style, list);
  }
}

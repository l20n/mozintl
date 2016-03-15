
import { localeRules } from '../data/plural-rules';

function getPluralRule(code, type) {
  // return a function that gives the plural form name for a given integer
  const index = localeRules[code.replace(/-.*$/, '')];
  if (!index) {
    return () => 'other';
  }
  if (!(type in index)) {
    return () => 'other';
  }
  return index[type];
}

function getOperands(num) {
  let stringValue = num.toString();

  if (stringValue.startsWith('-')) {
    stringValue = stringValue.substr(1);
  }

  const dp = stringValue.indexOf('.');

  let iv, fv;
  let n = parseFloat(stringValue),
    i = 0, v = 0, f = 0, t = 0, w = 0;


  if (dp === -1) {
    iv = stringValue;
  } else {
    iv = stringValue.substr(0, dp);
    fv = stringValue.substr(dp + 1);
    f = parseInt(fv);
    v = fv.length;
  }

  i = parseInt(iv);

  if (f !== 0) {
    t = fv;

    while (t.endsWith(0)) {
      t = t.slice(0, -1);
    }

    w = t.length;
    t = parseInt(t);
  }

  return {n, i, v, w, f, t};
}

export class PluralRules {
  constructor(locales = 'en-US', options = {}) {
    const localeList = Array.isArray(locales) ? locales : [locales];

    this._resolvedOptions = Object.assign({
      locale: localeList[0],
      type: 'cardinal',
    }, options);
  }

  resolvedOptions() {
    return this._resolvedOptions;
  }

  select(num) {
    const pluralRuleFn = getPluralRule(
      this._resolvedOptions.locale, this._resolvedOptions.type);

    const {n, i, v, w, f, t} = getOperands(num);

    return pluralRuleFn(n, i, v, w, f, t);
  }
}

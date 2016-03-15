
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
  let sv = num.toString();

  if (sv.startsWith('-')) {
    sv = sv.substr(1);
  }

  const dp = sv.indexOf('.');

  let iv, fv;
  let n = Number(sv),
    i = 0, v = 0, f = 0, t = 0, w = 0;


  if (dp === -1) {
    iv = sv;
  } else {
    iv = sv.substr(0, dp);
    fv = sv.substr(dp + 1);
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

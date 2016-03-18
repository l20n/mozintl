import { BaseFormat} from './base';

import { localeRules } from '../../data/plural-rules';

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

function getOperands(x) {
  const sv = x.toString();

  let iv, fv;
  let n = Number(sv),
    i = 0, v = 0, f = 0, t = 0, w = 0;

  const dp = sv.indexOf('.');

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
    let ft = fv;

    while (ft.endsWith('0')) {
      ft = ft.slice(0, -1);
    }

    w = ft.length;
    t = parseInt(ft);
  }

  if (parseInt(x) < 0) {
    n = -n;
    i = -i;
  }

  return {n, i, v, w, f, t};
}

export class PluralRules extends BaseFormat {
  constructor(locales, options) {
    super(locales, options, {
      type: 'cardinal',
    });
  }

  select(num) {
    const pluralRuleFn = getPluralRule(
      this._resolvedOptions.locale, this._resolvedOptions.type);

    const {n, i, v, w, f, t} = getOperands(num);

    return pluralRuleFn(n, i, v, w, f, t);
  }
}

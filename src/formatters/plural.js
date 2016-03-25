import { BaseFormat} from './base';

import { localeRules } from '../../data/plural-rules';

function GetNumberOption(options, prop, min, max, fallback) {
  let value = options[prop];

  if (value !== undefined) {
    let value = Number(value);
    if (value === NaN || value < min || value > max) {
      throw RangeError('Value outside of range');
    }
    return Math.floor(value);
  }
  return fallback;
}

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
      minimumIntegerDigits: 1,
      minimumFractionDigits: undefined,
      maximumFractionDigits: 3,
      minimumSignificantDigits: undefined,
      maximumSignificantDigits: undefined
    });

    this._resolvedOptions.minimumIntegerDigits =
      GetNumberOption(options, 'minimumIntegerDigits', 1, 21, 1);

    let mnfd = GetNumberOption(options, 'minimumFractionDigits', 0, 20, 0);
    this._resolvedOptions.minimumFractionDigits = mnfd;

    let._resolvedOptions.maximumFractionDigits =
      GetNumberOption(options,
                      'maximumFractionDigits', mnfd, 20, Math.max(mnfd, 3));

    if (options['minimumSignificantDigits'] ||
        options['maximumSignificantDigits']) {
      let mnsd =
        GetNumberOption(options, 'minimumSignificantDigits', 1, 21, 1);
      this._resolvedOptions.minimumSignificantDigits = mnsd;
        
      this._resolvedOptions.maximumSignificantDigits =
        GetNumberOption(options, 'maximumSignificantDigits', mnsd, 21, 1);
    }
  }

  select(num) {
    const pluralRuleFn = getPluralRule(
      this._resolvedOptions.locale, this._resolvedOptions.type);

    if (this._resolvedOptions.minimumSignificantDigits !== undefined &&
        this._resolvedOptions.maximumSignificantDigits !== undefined) {

    }
    const {n, i, v, w, f, t} = getOperands(num);

    return pluralRuleFn(n, i, v, w, f, t);
  }
}

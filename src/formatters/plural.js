/* eslint no-magic-numbers: [0] */
import { BaseFormat} from './base';

import { localeRules } from '../../data/plural-rules';

function GetNumberOption(options, prop, min, max, fallback) {
  let value = options[prop];

  if (value !== undefined) {
    value = Number(value);
    if (value === NaN || value < min || value > max) {
      throw RangeError('Value outside of range');
    }
    return Math.floor(value);
  }
  return fallback;
}

function ToRawPrecision(x, minPrecision, maxPrecision) {
  const p = maxPrecision;
  let m, e;

  if (x === 0) {
    m = Array(p + 1).join('0');
    e = 0;
  } else {
    e = Math.floor(Math.log10(Math.abs(x)));
    const f = Math.round(Math.exp((Math.abs(e - p + 1)) * Math.LN10));

    m = String(Math.round(e - p + 1 < 0 ? x * f : x / f));
  }

  if (e >= p) {
    return m + Array(e - p + 1 + 1).join('0');
  } else if (e === p - 1) {
    return m;
  } else if (e >= 0) {
    m = m.slice(0, e + 1) + '.' + m.slice(e + 1);
  } else if (e < 0) {
    m = '0.' + Array(-(e + 1) + 1).join('0') + m;
  }

  if (m.indexOf('.') >= 0 && maxPrecision > minPrecision) {
    let cut = maxPrecision - minPrecision;

    while (cut > 0 && m.charAt(m.length - 1) === '0') {
      m = m.slice(0, -1);
      cut--;
    }
    if (m.chatAt(m.length - 1) === '.') {
      m = m.slice(0, -1);
    }
  }
  return m;
}

function ToRawFixed(x, minInteger, minFraction, maxFraction) {
  let m = Number.prototype.toFixed.call(x, maxFraction);
  const idx = m.indexOf('e');
  let igr = m.split('.')[0].length;
  let cut = maxFraction - minFraction;
  const exp = idx > -1 ? m.slice(idx + 1) : 0;

  if (exp) {
    m = m.slice(0, idx).replace('.', '');
    m += Array(exp - (m.length - 1) + 1).join('0') +
      '.' + Array(maxFraction + 1).join('0');

    igr = m.length;
  }

  while (cut > 0 && m.slice(-1) === '0') {
    m = m.slice(0, -1);
    cut--;
  }

  if (m.slice(-1) === '.') {
    m = m.slice(0, -1);
  }

  let z;
  if (igr < minInteger) {
    z = Array(minInteger - igr + 1).join('0');
  }

  return (z ? z : '') + m;
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

function getOperands(n) {
  let iv, fv;
  let i = 0, v = 0, f = 0, t = 0, w = 0;

  const dp = n.indexOf('.');

  if (dp === -1) {
    iv = n;
  } else {
    iv = n.substr(0, dp);
    fv = n.substr(dp + 1);
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

  return {n, i, v, w, f, t};
}

export class PluralRules extends BaseFormat {
  constructor(locales, options = {}) {
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

    const mnfd = GetNumberOption(options, 'minimumFractionDigits', 0, 20, 0);
    this._resolvedOptions.minimumFractionDigits = mnfd;

    this._resolvedOptions.maximumFractionDigits =
      GetNumberOption(options,
                      'maximumFractionDigits', mnfd, 20, Math.max(mnfd, 3));

    if (options['minimumSignificantDigits'] ||
        options['maximumSignificantDigits']) {
      const mnsd =
        GetNumberOption(options, 'minimumSignificantDigits', 1, 21, 1);
      this._resolvedOptions.minimumSignificantDigits = mnsd;
        
      this._resolvedOptions.maximumSignificantDigits =
        GetNumberOption(options, 'maximumSignificantDigits', mnsd, 21, 1);
    }
  }

  select(x) {
    let n;

    x = Number(x);

    if (!isFinite(x)) {
      return 'other';
    }

    if (this._resolvedOptions.minimumSignificantDigits !== undefined &&
        this._resolvedOptions.maximumSignificantDigits !== undefined) {
      n = ToRawPrecision(x,
                         this._resolvedOptions.minimumSignificantDigits,
                         this._resolvedOptions.maximumSignificantDigits);
    } else {
      n = ToRawFixed(x,
                     this._resolvedOptions.minimumIntegerDigits,
                     this._resolvedOptions.minimumFractionDigits,
                     this._resolvedOptions.maximumFractionDigits);
    }

    const pluralRuleFn = getPluralRule(
      this._resolvedOptions.locale, this._resolvedOptions.type);

    const {i, v, w, f, t} = getOperands(n);

    if (parseInt(x) < 0) {
      n = -n;
      i = -i;
    }
    return pluralRuleFn(n, i, v, w, f, t);
  }
}

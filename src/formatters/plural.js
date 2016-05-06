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

function GetOperands(s) {
  let n = Number(s);

  let iv, fv;
  let i = 0, v = 0, f = 0, t = 0, w = 0;

  const dp = s.indexOf('.');

  if (dp === -1) {
    iv = n;
  } else {
    iv = s.substr(0, dp);
    fv = s.substr(dp + 1);
    f = Number(fv);
    v = fv.length;
  }

  i = Math.abs(Number(iv));

  if (f !== 0) {
    let ft = fv;

    while (ft.endsWith('0')) {
      ft = ft.slice(0, -1);
    }

    w = ft.length;
    t = Number(ft);
  }

  return {
    '[[Number]]': n,
    '[[IntegerDigits]]': i,
    '[[NumberOfFractionDigits]]': v,
    '[[NumberOfFractionDigitsWithoutTrailing]]': w,
    '[[FractionDigits]]': f,
    '[[FractionDigitsWithoutTrailing]]': t
  };
}

function PluralRuleSelection(locale, type, operands) {
  const pluralRulesFn = getPluralRule(locale, type);
  return pluralRulesFn(
    operands['[[Number]]'],
    operands['[[IntegerDigits]]'],
    operands['[[NumberOfFractionDigits]]'],
    operands['[[NumberOfFractionDigitsWithoutTrailing]]'],
    operands['[[FractionDigits]]'],
    operands['[[FractionDigitsWithoutTrailing]]']
  );
}

function ResolvePlural(pluralRules, n) {
  if (!isFinite(n)) {
    return 'other';
  }

  let s;

  if (pluralRules['[[MinimumSignificantDigits]]'] !== undefined &&
      pluralRules['[[MaximumSignificantDigits]]'] !== undefined) {
    s = ToRawPrecision(n,
                       pluralRules['[[MinimumSignificantDigits]]'],
                       pluralRules['[[maximumSignificantDigits]]']);
  } else {
    s = ToRawFixed(n,
                   pluralRules['[[MinimumIntegerDigits]]'],
                   pluralRules['[[MinimumFractionDigits]]'],
                   pluralRules['[[MaximumFractionDigits]]']);
  }

  let locale = pluralRules['[[Locale]]'];
  let type = pluralRules['[[Type]]'];

  let operands = GetOperands(s);

  return PluralRuleSelection(locale, type, operands);
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

    this['[[MinimumIntegerDigits]]'] =
      GetNumberOption(options, 'minimumIntegerDigits', 1, 21, 1);

    const mnfd = GetNumberOption(options, 'minimumFractionDigits', 0, 20, 0);
    this['[[MinimumFractionDigits]]'] = mnfd;

    this['[[MaximumFractionDigits]]'] =
      GetNumberOption(options,
                      'maximumFractionDigits', mnfd, 20, Math.max(mnfd, 3));

    if (options['minimumSignificantDigits'] ||
        options['maximumSignificantDigits']) {
      const mnsd =
        GetNumberOption(options, 'minimumSignificantDigits', 1, 21, 1);
      this['[[MinimumSignificantDigits]]'] = mnsd;
        
      this['[[MaximumSignificantDigits]]'] =
        GetNumberOption(options, 'maximumSignificantDigits', mnsd, 21, 1);
    }
  }

  select(value) {
    let pluralRules = this;
    let n = Number(value);
    return ResolvePlural(pluralRules, n);
  }
}

/*eslint no-magic-numbers: [0]*/

// utility functions for plural rules methods
function isIn(n, list) {
  return list.find(n);
}
function isBetween(n, start, end) {
  return start <= n && n <= end;
}

function findInMap(map, n1, n2) {
  let v = map.find(elem => {
    return elem[0] === n1 && elem[1] === n2; 
  });
  if (v === undefined) {
    return 'other';
  } else {
    return v[2];
  }
}

const localeRules = {
  'en': {
    cardinal: (n, i, v, w, f, t) => {
      if (i === 1 && v === 0) {
        return 'one';
      }
      return 'other';
    },
    ordinal: (n, i, v, w, f, t) => {
      if (n % 10 === 1 && n % 1000 !== 11) {
        return 'one';
      }
      if (n % 10 === 2 && n % 10 !== 12) {
        return 'two';
      }
      if (n % 10 === 3 && n % 100 !== 13) {
        return 'few';
      }
      return 'other';
    },
    range: (n1, n2) => {
      return 'other';
    }
  },
  'fr': {
    cardinal: (n, i, v, w, f, t) => {
      if (i === 1 || i === 0) {
        return 'one';
      }
      return 'other';
    },
    ordinal: (n, i, v, w, f, t) => {
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    range: (n1, n2) => {
      if (n1 === 'one' && n2 === 'one') {
        return 'one';
      }
      return 'other';
    }
  },
  'pl': {
    cardinal: (n, i, v, w, f, t) => {
      if (i === 1 && v === 0) {
        return 'one';
      }
      if (v === 0 && isBetween(i % 10, 2, 4) && !isBetween(i % 100, 12, 14)) {
        return 'few';
      }
      if (v === 0 && (
            i !== 1 && isBetween(i % 10, 0, 1) ||
            isBetween(i % 10, 5, 9) ||
            isBetween(i % 100, 12, 14)
          )) {
        return 'many';
      }
      return 'other';
    },
    ordinal: (n, i, v, w, f, t) => {
      return 'other';
    },
    range: (n1, n2) => {
      return n2;
    }
  }
};

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

  const decimalSepPos = stringValue.indexOf('.');

  const n = Math.abs(parseFloat(stringValue));

  const i = parseInt(decimalSepPos === -1 ?
    stringValue : stringValue.substr(0, decimalSepPos));

  const v = decimalSepPos === -1 ? 0 : stringValue.length - decimalSepPos - 1;

  const f = decimalSepPos === -1 ? 
    0 : parseInt(stringValue.substr(decimalSepPos + 1));

  let t;
  let w;
  
  if (f === 0) {
    t = 0;
    w = 0;
  } else {
    t = stringValue.substr(decimalSepPos + 1);

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

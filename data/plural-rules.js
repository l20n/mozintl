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

export const localeRules = {
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

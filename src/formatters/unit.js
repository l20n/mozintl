import { BaseFormat} from './base';
import { deconstructPattern } from '../utils';

export const unitFormatGroups = {
  'duration': {
    'units': ['second', 'minute', 'hour', 'day', 'month'],
    'styles': ['narrow'],
    'rounding': 1
  },
  'digital': {
    'units': ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'],
    'styles': ['short'],
    'rounding': 0.8
  }
};

export const unitFormatData = {
  /*eslint no-magic-numbers: [0]*/
  'duration': [
    {'name': 'second', 'value': 1},
    {'name': 'minute', 'value': 60},
    {'name': 'hour', 'value': 60 * 60},
    {'name': 'day', 'value': 24 * 60 * 60},
    {'name': 'month', 'value': 30 * 24 * 60 * 60},
  ],
  'digital': [
    {'name': 'byte', 'value': 1},
    {'name': 'kilobyte', 'value': 1024},
    {'name': 'megabyte', 'value': 1024 * 1024},
    {'name': 'gigabyte', 'value': 1024 * 1024 * 1024},
    {'name': 'terabyte', 'value': 1024 * 1024 * 1024 * 1024},
  ],
};

function getUnitFormatGroupName(unit) {
  /*eslint prefer-const: 0*/
  for (let groupName in unitFormatGroups) {
    if (unitFormatGroups[groupName].units.includes(unit)) {
      return groupName;
    }
  }

  return undefined;
}

function selectUnit(type, x) {
  const units = unitFormatData[type];

  let scale = 0;

  for (let i = 1; i < units.length; i++) {
    if (x < units[i].value * unitFormatGroups[type].rounding) {
      scale = i - 1;
      break;
    } else if (i === units.length - 1) {
      scale = i;
    }
  }

  const value = Math.round(x / units[scale].value * 100) / 100;

  return {
    unit: units[scale].name,
    value
  };
}

function FormatToParts(patternId, x) {
  return document.l10n.formatValue(patternId, {
    value: x
  }).then(pattern => {
    return deconstructPattern(pattern, {
      value: {type: 'number', value: x}
    });
  });
}

export class UnitFormat extends BaseFormat {
  constructor(locales, options) {
    super(locales, options, {
      unit: 'bestFit',
      type: undefined,
      style: 'long'
    });

    if (this['[[Unit]]'] !== 'bestFit') {
      this['[[Type]]'] = getUnitFormatGroupName(
        this['[[Unit]]']);
    }

    if (this['[[Type]]'] === undefined) {
      throw new RangeError(`invalid value ${options.unit} for option unit`);
    }

    if (!unitFormatGroups[this['[[Type]]']].styles.includes(
          this['[[Style]]'])) {
      throw new RangeError(`invalid value ${options.style} for option style`);
    }
  }

  format(x) {
    if (isNaN(parseInt(x))) {
      return Promise.resolve(undefined);
    }
    const type = this['[[Type]]'];
    let unit, value;
    if (this['[[Unit]]'] === 'bestFit') {
      const vals = selectUnit(type, x);
      unit = vals.unit;
      value = vals.value;
    } else {
      unit = this['[[Unit]]'];
      value = x;
    }
    const style = this['[[Style]]'];
    const patternId = `unitformat-${type}-${unit}-${style}`;

    return FormatToParts(patternId, value).then(parts => {
      return parts.reduce((string, part) => string + part.value, '');
    });
  }

  formatToParts(x) {
    return FormatToParts(this._patternId, x);
  }
}

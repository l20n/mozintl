import { BaseFormat} from './baseformat';
import { deconstructPattern } from './utils';

const unitFormatGroups = {
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

function getUnitFormatGroupName(unitName) {
  for (let groupName in unitFormatGroups) {
    if (unitFormatGroups[groupName].units.includes(unitName)) {
      return groupName;
    }
  }
  return undefined;
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
      unit: undefined,
      style: 'long'
    });

    const unitGroup = getUnitFormatGroupName(this._resolvedOptions.unit);

    if (unitGroup === undefined) {
      throw new RangeError(`invalid value ${options.unit} for option unit`);
    }

    if (!unitFormatGroups[unitGroup].styles.includes(
          this._resolvedOptions.style)) {
      throw new RangeError(`invalid value ${options.style} for option style`);
    }

    this._patternId = `${unitGroup}-${options.unit}-${options.style}`;
  }

  format(x) {
    return FormatToParts(this._patternId, x).then(parts => {
      return parts.reduce((string, part) => string + part.value, '');
    });
  }

  formatToParts(list) {
    return FormatToParts(this._patternId, x);
  }
}

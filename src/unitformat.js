import { BaseFormat} from './baseformat';

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

    this._unit = `${unitGroup}-${options.unit}-${options.style}`;
  }

  format(x) {
    return document.l10n.formatValue(this._unit, {
      value: x
    });
  }

  formatToParts(list) {
    return FormatToParts(type, style, list);
  }
}

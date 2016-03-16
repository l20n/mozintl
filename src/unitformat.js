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

export class UnitFormat {
  constructor(locales = 'en-US', options = {}) {
    const localeList = Array.isArray(locales) ? locales : [locales];

    this._resolvedOptions = Object.assign({
      locale: localeList[0],
      unit: undefined,
      style: 'long'
    }, options);

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

  resolvedOptions() {
    return this._resolvedOptions;
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

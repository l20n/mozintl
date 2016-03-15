
const durationFormatOrder = ['hour', 'minute', 'second', 'millisecond'];
const durationFormatElements = {
  'hour': {value: 3600000, token: 'hh'},
  'minute': {value: 60000, token: 'mm'},
  'second': {value: 1000, token: 'ss'},
  // rounding milliseconds to tens
  'millisecond': {value: 10, token: 'SS'}
};

/*
 * This helper function is used by splitIntoTimeUnits
 */
function getDurationUnitIdx(name, defaultValue) {
  if (!name) {
    return defaultValue;
  }
  const pos = durationFormatOrder.indexOf(name);
  if (pos === -1) {
    throw new Error('Unknown unit type: ' + name);
  }
  return pos;
}

/*
 * This helper function is used by DurationFormat
 */
function splitIntoTimeUnits(v, maxUnitIdx, minUnitIdx) {
  const units = {};
  var input = Math.abs(v);


  for (var i = maxUnitIdx; i <= minUnitIdx; i++) {
    const key = durationFormatOrder[i];
    const {value} = durationFormatElements[key];
    units[key] = i == minUnitIdx ?
      Math.round(input / value) :
      Math.floor(input / value);
    input -= units[key] * value;
  }
  return units;
}

function trimDurationPattern(string, maxUnit, minUnit) {
  const maxToken = durationFormatElements[maxUnit].token;
  const minToken = durationFormatElements[minUnit].token;

  // We currently know of no format that would require reverse order
  // Even RTL languages use LTR duration formatting, so all we care
  // are separators.
  string = string.substring(
    string.indexOf(maxToken),
    string.indexOf(minToken) + minToken.length);
  return string;
}

export class DurationFormat {
  constructor(locales = 'en-US', options = {}) {
    const localeList = Array.isArray(locales) ? locales : [locales];

    this._resolvedOptions = Object.assign({
      locale: localeList[0],
      maxUnit: 'hour',
      minUnit: 'second'
    }, options);

    this._numFormatter = Intl.NumberFormat(locales, {
      style: 'decimal',
      useGrouping: false,
      minimumIntegerDigits: 2
    });

    this._maxUnitIdx = getDurationUnitIdx(this._resolvedOptions.maxUnit, 0);
    this._minUnitIdx = getDurationUnitIdx(this._resolvedOptions.minUnit,
      durationFormatOrder.length - 1);
  }

  resolvedOptions() {
    return this._resolvedOptions;
  }

  format(input) {
    return document.l10n.formatValue('durationformat-pattern').then(fmt => {
      // Rounding minUnit to closest visible unit
      const minValue = durationFormatElements[this._resolvedOptions.minUnit].value;
      input = Math.round(input / minValue) * minValue;

      const duration = splitIntoTimeUnits(input, this._maxUnitIdx, this._minUnitIdx);

      var string = trimDurationPattern(fmt,
                                       this._resolvedOptions.maxUnit, this._resolvedOptions.minUnit);


      for (var unit in duration) {
        const token = durationFormatElements[unit].token;

        string = string.replace(token,
                                this._numFormatter.format(duration[unit]));
      }

      if (input < 0) {
        return '-' + string;
      }
      return string;
    });
  }

  formatToParts(list) {
    return FormatToParts(type, style, list);
  }
}

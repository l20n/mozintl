import { BaseFormat} from './base';
import { deconstructPattern } from '../utils';

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
function splitIntoTimeUnits(v, maxUnitIdx, minUnitIdx, formatter) {
  const units = {};
  let input = Math.abs(v);


  for (let i = maxUnitIdx; i <= minUnitIdx; i++) {
    const key = durationFormatOrder[i];
    const {value, token} = durationFormatElements[key];
    const roundedValue = i === minUnitIdx ?
        Math.round(input / value) : Math.floor(input / value);
    units[token] = {
      type: key,
      value: formatter.format(roundedValue)
    };
    input -= roundedValue * value;
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
    string.indexOf('{' + maxToken + '}'),
    string.indexOf('{' + minToken + '}') + minToken.length + 2);
  return string;
}

function FormatToParts(minUnit, maxUnit, input) {
  return document.l10n.formatValue('durationformat-pattern').then(fmt => {
    // Rounding minUnit to closest visible unit
    const minValue = durationFormatElements[minUnit].value;
    input = Math.round(input / minValue) * minValue;

    const duration = splitIntoTimeUnits(
      input,
      this._maxUnitIdx,
      this._minUnitIdx,
      this._numFormatter);

    const string = trimDurationPattern(fmt, maxUnit, minUnit);

    const parts = deconstructPattern(string, duration);

    if (input < 0) {
      parts.unshift({type:'negativeSign', value: '-'});
    }
    return parts;
  });
}

export class DurationFormat extends BaseFormat {
  constructor(locales, options) {
    super(locales, options, {
      maxUnit: 'hour',
      minUnit: 'second'
    });

    this._numFormatter = Intl.NumberFormat(locales, {
      style: 'decimal',
      useGrouping: false,
      minimumIntegerDigits: 2
    });

    this._maxUnitIdx = getDurationUnitIdx(this._resolvedOptions.maxUnit, 0);
    this._minUnitIdx = getDurationUnitIdx(this._resolvedOptions.minUnit,
      durationFormatOrder.length - 1);
  }

  format(input) {
    const minUnit = this._resolvedOptions.minUnit;
    const maxUnit = this._resolvedOptions.maxUnit;
    return FormatToParts.call(this, minUnit, maxUnit, input).then(parts => {
      return parts.reduce((string, part) => string + part.value, '');
    });
  }

  formatToParts(input) {
    const minUnit = this._resolvedOptions.minUnit;
    const maxUnit = this._resolvedOptions.maxUnit;
    return FormatToParts.call(this, minUnit, maxUnit, input);
  }
}

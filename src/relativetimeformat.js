import { BaseFormat} from './baseformat';

function computeTimeUnits(v) {
  const units = {};
  const millisecond = Math.round(v);
  const second = Math.round(millisecond / 1000);
  const minute = Math.round(second / 60);
  const hour = Math.round(minute / 60);
  const day = Math.round(hour / 24);
  const rawYear = day * 400 / 146097;
  units.millisecond = millisecond;
  units.second = second;
  units.minute = minute;
  units.hour = hour;
  units.day = day;
  units.week = Math.round(day / 7);
  units.month = Math.round(rawYear * 12);
  units.quarter = Math.round(rawYear * 4);
  units.year = Math.round(rawYear);
  return units;
}

function getBestMatchUnit(units) {
  //if (Math.abs(units.second) < 45) { return 'second'; }
  if (Math.abs(units.minute) < 45) { return 'minute'; }
  if (Math.abs(units.hour) < 22) { return 'hour'; }
  // Intl uses 26 days here
  if (Math.abs(units.day) < 7) { return 'day'; }
  if (Math.abs(units.week) < 4) { return 'week'; }
  if (Math.abs(units.month) < 11) { return 'month'; }
  //if (Math.abs(units.quarter) < 4) { return 'quarter'; }
  return 'year';
}

function relativeTimeFormatId(x, options) {
  const ms = x - Date.now();
  const units = computeTimeUnits(ms);

  const unit = options.unit === 'bestFit' ?
    getBestMatchUnit(units) : options.unit;

  const v = units[unit];

  // CLDR uses past || future
  const tl = v < 0 ? '-ago' : '-until';
  const style = options.style || 'long';

  const entry = unit + 's' + tl + '-' + style;

  return {
    unit: entry,
    value: Math.abs(v)
  };
}

export class RelativeTimeFormat extends BaseFormat {
  constructor(locales, options) {
    super(locales, options, {
      unit: 'bestFit',
      style: 'long'
    });
  }

  format(x) {
    const {unit, value} = relativeTimeFormatId(x, this._resolvedOptions);
    return document.l10n.formatValue(unit, {
      value
    });
  }

  formatToParts(list) {
    return FormatToParts(type, style, list);
  }
}

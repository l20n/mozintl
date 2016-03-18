import { computerTimeUnits,
         getBestMatchUnit,
         relativeTimeFormatId } from './relativetimeformat';

import { unitFormatGroups } from './unitformat';

const unitFormatData = {
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

export const gaia = {
  // This is an internal Firefox OS function, not part of the future standard
  relativePart: function(milliseconds) {
    const units = computeTimeUnits(milliseconds);
    const unit = getBestMatchUnit(units);
    return {
      unit: unit + 's',
      value: Math.abs(units[unit])
    };
  },

  // This is an internal Firefox OS function, not part of the future standard
  RelativeDate: function(locales, options) {
    const style = options && options.style || 'long';
    const maxFormatter = Intl.DateTimeFormat(locales, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    const relativeFmtOptions = {
      unit: 'bestFit',
      style: style,
      minUnit: 'minute',
    };

    return {
      format: function(time, maxDiff) {
        maxDiff = maxDiff || 86400 * 10; // default = 10 days
        const secDiff = (Date.now() - time) / 1000;
        if (isNaN(secDiff)) {
          return document.l10n.formatValue('incorrectDate');
        }

        if (secDiff > maxDiff) {
          return Promise.resolve(maxFormatter.format(time));
        }

        const {unit, value} = relativeTimeFormatId(time, relativeFmtOptions);
        return document.l10n.formatValue(unit, {
          value
        });
      },
      formatElement: function(element, time, maxDiff) {
        maxDiff = maxDiff || 86400 * 10; // default = 10 days
        const secDiff = (Date.now() - time) / 1000;
        if (isNaN(secDiff)) {
          element.setAttribute('data-l10n-id', 'incorrectDate');
        }

        element.removeAttribute('data-l10n-id');
        if (secDiff > maxDiff) {
          element.textContent = maxFormatter.format(time);
        }

        const {unit, value} = relativeTimeFormatId(time, relativeFmtOptions);
        document.l10n.setAttributes(element, unit, {
          value
        });
      },
    };
  },

  getFormattedUnit: function(type, style, v) {
    if (isNaN(parseInt(v))) {
      return Promise.resolve(undefined);
    }

    if (!unitFormatData.hasOwnProperty(type)) {
      throw new RangeError(`invalid type ${type}`);
    }
    if (!unitFormatGroups[type].styles.includes(style)) {
      throw new RangeError(`invalid style ${style} for type ${type}`);
    }
    var units = unitFormatData[type];

    var scale = 0;

    for (let i = 1; i < units.length; i++) {
      if (v < units[i].value * unitFormatGroups[type].rounding) {
        scale = i - 1;
        break;
      } else if (i === units.length - 1) {
        scale = i;
      }
    }

    var value = Math.round(v / units[scale].value * 100) / 100;

    return global.mozIntl.UnitFormat(navigator.languages, {
      unit: units[scale].name,
      style: style
    }).format(value);
  },
}

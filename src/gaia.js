import { computeTimeUnits,
         getBestMatchUnit,
         relativeTimeFormatId } from './formatters/relativetime';

const DAY_IN_S = 86400;
const SECOND_IN_MS = 1000;
const MAX_DAYS = 10;
// 10 days
const DEFAULT_MAX_DIFF = DAY_IN_S * MAX_DAYS;

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
        maxDiff = maxDiff || DEFAULT_MAX_DIFF;
        const secDiff = (Date.now() - time) / SECOND_IN_MS;
        if (isNaN(secDiff)) {
          return document.l10n.formatValue('incorrectDate');
        }

        if (secDiff > maxDiff) {
          return Promise.resolve(maxFormatter.format(time));
        }

        const {patternId, value} =
          relativeTimeFormatId(time,
                               relativeFmtOptions.unit,
                               relativeFmtOptions.style);

        return document.l10n.formatValue(patternId, {
          value
        });
      },

      formatElement: function(element, time, maxDiff) {
        maxDiff = maxDiff || DEFAULT_MAX_DIFF;
        const secDiff = (Date.now() - time) / SECOND_IN_MS;
        if (isNaN(secDiff)) {
          element.setAttribute('data-l10n-id', 'incorrectDate');
        }

        if (secDiff > maxDiff) {
          element.removeAttribute('data-l10n-id');
          element.textContent = maxFormatter.format(time);
        }

        const {patternId, value} =
          relativeTimeFormatId(time,
                               relativeFmtOptions.unit,
                               relativeFmtOptions.style);

        document.l10n.setAttributes(element, patternId, {
          value
        });
      },
    };
  },
};

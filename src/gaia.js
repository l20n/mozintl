import { computerTimeUnits,
         getBestMatchUnit,
         relativeTimeFormatId } from './relativetimeformat';

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
}

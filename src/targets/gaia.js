import { ListFormat } from '../formatters/list';
import { getCanonicalLocales, getCalendarInfo } from '../locale';
import { DurationFormat } from '../formatters/duration';
import { RelativeTimeFormat } from '../formatters/relativetime';
import { UnitFormat } from '../formatters/unit';
import { gaia } from '../gaia';


window.mozIntl = {
  ListFormat,
  DurationFormat,
  RelativeTimeFormat,
  UnitFormat,
  getCanonicalLocales,
  getCalendarInfo,
  _gaia: gaia
};

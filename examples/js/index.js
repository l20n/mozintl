const testValues = [
  {
    name: 'ListFormat',
    formatter: mozIntl.ListFormat,
    testMethod: 'format',
    params: ['type', 'style'],
    values: [
      {type: 'regular', style: 'long', value: ['Anna']},
      {type: 'regular', style: 'long', value: ['Anna', 'John']},
      {type: 'regular', style: 'long', value: ['Anna', 'John', 'Ian']},
      {type: 'regular', style: 'long', value: ['Anna', 'John', 'Ian', 'Nick']},
      {type: 'regular', style: 'long', value: ['Anna', 'John', 'Ian', 'Nick', 'Mark', 'Woody']},

      {type: 'duration', style: 'long', value: ['Monday']},
      {type: 'duration', style: 'long', value: ['Monday', 'Tuesday']},
      {type: 'duration', style: 'long', value: ['Monday', 'Tuesday', 'Wednesday']},

      {type: 'duration', style: 'short', value: ['Monday']},
      {type: 'duration', style: 'short', value: ['Monday', 'Tuesday']},
      {type: 'duration', style: 'short', value: ['Monday', 'Tuesday', 'Wednesday']},

      {type: 'duration', style: 'narrow', value: ['Monday']},
      {type: 'duration', style: 'narrow', value: ['Monday', 'Tuesday']},
      {type: 'duration', style: 'narrow', value: ['Monday', 'Tuesday', 'Wednesday']},

      {type: 'unit', style: 'long', value: ['2km']},
      {type: 'unit', style: 'long', value: ['2km', '35m']},
      {type: 'unit', style: 'long', value: ['2km', '35m', '15cm']},

      {type: 'number', style: 'long', value: ['23']},
      {type: 'number', style: 'long', value: ['23', '15']},
      {type: 'number', style: 'long', value: ['23', '15', '51']},
    ]
  },
  {
    name: 'PluralRules',
    formatter: mozIntl.PluralRules,
    testMethod: 'select',
    params: ['type'],
    values: [
      {type: 'cardinal', value: 0},
      {type: 'cardinal', value: 1},
      {type: 'cardinal', value: 3},
      {type: 'cardinal', value: 5},
      {type: 'cardinal', value: 23},
      {type: 'cardinal', value: "1.5"},
      {type: 'cardinal', locale: 'pl', value: 0},
      {type: 'cardinal', locale: 'pl', value: 1},
      {type: 'cardinal', locale: 'pl', value: 3},
      {type: 'cardinal', locale: 'pl', value: 5},
      {type: 'cardinal', locale: 'pl', value: 23},
      {type: 'cardinal', locale: 'pl', value: "1.5"},
      {type: 'cardinal', locale: 'fr', value: "1.5"},
      {type: 'cardinal', locale: 'fr', value: "2.0"},
      {type: 'ordinal', locale: 'pl', value: "5"},
    ]
  },
  {
    name: 'getCanonicalLocales',
    testMethod: 'getCanonicalLocales',
    params: [],
    values: [
      {value: 'en-us'},
      {value: 'PL'},
      {value: 'de-De-u-ast'},
      {value: 'Zh-NAN-haNS-bu-variant2-Variant1-u-ca-chinese-t-Zh-laTN-x-PRIVATE'},
      {value: ['dE-De', 'pL-pl', 'en-Fr'] }
    ],
  },
  {
    name: 'DurationFormat',
    formatter: mozIntl.DurationFormat,
    testMethod: 'format',
    params: ['minUnit', 'maxUnit'],
    values: [
      {minUnit: 'second', maxUnit: 'hour', value: 0},
      {minUnit: 'second', maxUnit: 'hour', value: 534141413},
      {minUnit: 'millisecond', maxUnit: 'hour', value: -534141413},
    ]
  },
  {
    name: 'RelativeTimeFormat',
    formatter: mozIntl.RelativeTimeFormat,
    testMethod: 'format',
    params: ['unit', 'style'],
    values: [
      {unit: 'hour', style: 'long', value: Date.now() - 1000 * 60 * 60 * 4},
      {unit: 'minute', style: 'long', value: Date.now() + 1000 * 60 * 2},
    ]
  },
  {
    name: 'UnitFormat',
    formatter: mozIntl.UnitFormat,
    testMethod: 'format',
    params: ['unit', 'type', 'style'],
    values: [
      {unit: 'byte', style: 'short', value: 10},
      {unit: 'month', style: 'narrow', value: 10},
      {unit: 'gigabyte', style: 'short', value: 10},
      {unit: 'hour', style: 'narrow', value: 10},
      {type: 'duration', style: 'narrow', value: 10 * 24 * 60 * 60},
    ]
  },
];

function displayExampleValues() {
  testValues.forEach(bundle => {
    let name = bundle.formatter ? bundle.name : bundle.testMethod;

    const root = document.getElementById(`${name.toLowerCase()}_examples_table`);

    const thead = root.querySelector('thead');

    let tr = document.createElement('tr');

    let params = bundle.params.slice();

    if (bundle.formatter) {
      params.push('locale');
    }

    params.push('value', 'output');

    params.forEach(param => {

      let th = document.createElement('th');
      th.textContent = param;
      tr.appendChild(th);
    });

    thead.appendChild(tr);

    bundle.values.forEach(val => {
      let tr = document.createElement('tr');

      let locale = val.locale || 'en-US';

      let options = {};

      bundle.params.forEach(param => {
        if (val[param]) {
          options[param] = val[param];
        }
      });

      let obj = bundle.formatter ?
        new bundle.formatter(locale, options) : mozIntl;

      params.forEach(param => {
        if (param === 'output') return;

        let td = document.createElement('td');
        if (param === 'locale') {
          td.textContent = locale;
        } else {
          if (bundle.formatter) {
            td.textContent = obj.resolvedOptions()[param];
          } else {
            td.textContent = val[param];
          }
        }
        tr.appendChild(td);
      });



      td = document.createElement('td');

      var ret = obj[bundle.testMethod](val.value);

      if (ret.then) {
        ret.then(function(td, res) {
          td.textContent = res;
        }.bind(this, td));
      } else {
        td.textContent = ret;
      }
      tr.appendChild(td);

      root.appendChild(tr);
    });
  });
}

displayExampleValues();

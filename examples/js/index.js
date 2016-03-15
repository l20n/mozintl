const listFormatValues = [
  {type: 'regular', style: 'long', value: ['Anna']},
  {type: 'regular', style: 'long', value: ['Anna', 'John']},
  {type: 'regular', style: 'long', value: ['Anna', 'John', 'Ian']},
  {type: 'regular', style: 'long', value: ['Anna', 'John', 'Ian', 'Nick']},

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
];

const pluralRulesValues = [
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
];


function displayListFormatValues() {
  const root = document.getElementById('listformat_examples_body');

  listFormatValues.forEach(val => {
    let tr = document.createElement('tr');

    let td = document.createElement('td');
    td.textContent = val.type;
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = val.style;
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = val.value;
    tr.appendChild(td);

    var formatter = new mozIntl.ListFormat(navigator.languages, {
      type: val.type,
      style: val.style
    });

    td = document.createElement('td');
    formatter.format(val.value).then(res => {
      td.textContent = res;
    });
    tr.appendChild(td);

    root.appendChild(tr);
  });
}

function displayPluralRulesValues() {
  const root = document.getElementById('pluralrules_examples_body');

  pluralRulesValues.forEach(val => {
    var plural = new mozIntl.PluralRules(val.locale || navigator.languages, {
      type: val.type
    });

    let tr = document.createElement('tr');

    let td = document.createElement('td');
    td.textContent = val.type;
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = plural.resolvedOptions().locale;
    tr.appendChild(td);

    td = document.createElement('td');
    td.textContent = val.value;
    tr.appendChild(td);


    td = document.createElement('td');
    td.textContent = plural.select(val.value);
    tr.appendChild(td);

    root.appendChild(tr);
  });
}

displayListFormatValues();
displayPluralRulesValues();

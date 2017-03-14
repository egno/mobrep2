export const reports = [
  {
    caption: 'Отчёт руководителя',
    name: 'gdlivescreen',
    path: 'report',
    uri: 'gdlivescreen2',
    fixedColumn: 'Филиал',
    screens: [
      { caption: '! Факт',
        columns: [
          { name: 'Факт,млн.р', caption: 'Факт', total: 'sum' },
          { name: 'План,млн.р', type: 'base', total: 'sum' }
        ]
      },
      {
        columns: [
          { name: 'Выполн.%', total: 'avg' },
          { name: 'Выпол. Год, %', type: 'base', total: 'avg' }
        ]
      },
      {
        columns: [
          { name: '%РН', total: 'avg' },
          { name: 'РН.млн.р', type: 'saturation', total: 'sum' }
        ]
      },
      {
        columns: [
          { name: 'РН.млн.р', total: 'sum' },
          { name: 'РН на душу нас.', total: 'avg' } ]
      },
      {
        columns: [
          { name: 'ДЗ,млн.р', total: 'sum' },
          { name: 'ДЗ,%проср', total: 'avg' } ]
      },
      {
        columns: [
          { name: 'Оборот ДЗ', total: 'sum' },
          { name: 'ДЗ,%проср', total: 'avg' } ]
      },
      {
        columns: [ { name: '%ЭСП', total: 'avg' } ]
      },
      {
        columns: [ { name: 'Скл.наимен.', total: 'avg' }, { name: 'На скл,млн.р', total: 'sum' } ]
      },
      {
        columns: [ { name: 'В пути,мл.р', total: 'sum' }, { name: 'В пути,дн' } ]
      },
      {
        columns: [ { name: 'Резерв,дн' }, { name: 'В пути,дн', total: 'avg' } ]
      },
      {
        columns: [ { name: 'На скл,млн.р', total: 'sum' }, { name: 'На скл,дн', total: 'avg' } ]
      },
      {
        columns: [ { name: 'Фин.цикл,дн', total: 'avg' } ]
      },
      {
        columns: [ { name: 'Прибыль,млн.р', total: 'sum' }, { name: 'ТС,млн.р' } ]
      },
      {
        columns: [ { name: 'УП(1000ч.)' }, { name: 'Доля филиала' } ]
      }
    ]
  }
]

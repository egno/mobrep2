export const reports = [
  {
    caption: 'Экран контроля сбыта', // Отображаемый заголовок отчёта
    path: 'report', // Наименование компонента, отображающего отчёт (путь к шаблону отчёта для адресной строки)
    name: 'gdlivescreen', // Наименование отчёта для адресной строки
    uri: 'gdlivescreen', // Наименование ресурса API БД (представления или таблицы в БД)
    fixedColumn: 'Филиал',  // Наименование для первого, фиксированного для всех экранов, столбца
    screens: [  // Перечисление экранов
      { caption: '! Факт', // Отображаемый заголовок экрана (необязательный)
        columns: [ // Перечисление столбцов экрана
          {
            name: 'Факт,млн.р', // Наименование столбца (поле в БД)
            caption: 'Факт', // Отображаемый заголовок столбца (необязательный)
            total: 'sum' // Что отображать в итогах (необязательный):
              // sum - сумму по стобцу
              // avg - среднее по столбцу
              // В других случаях итог по столбцу не выводится
          },
          {
            name: 'План,млн.р',
            type: 'base', // Тип столбца (необязательный)
              // Если указан тип = 'base', то автоматически добавляется третий столбец,
              // в котором отображается процентное отношение значений первого столбца ко второму
              // это отношение используется для определения цвета строки.
              // Если тип не указан, то для определения цвета строки
              // используется значение второго столбца
            total: 'sum'
          }
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
          { name: 'РН.млн.р', total: 'sum' }
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
  },
  {
    caption: 'Экран контроля склада',
    path: 'report',
    name: 'gdlivescreendepot',
    uri: 'gdlivescreendepot',
    fixedColumn: 'Филиал',
    screens: [
      { columns: [
          { name: 'Собр.поз,шт', total: 'sum' },
          { name: 'Ср. время раб.,ч', total: 'avg' }
      ]},
      { caption: 'Время оконч.',
        columns: [
          { name: 'Собр.поз,шт', total: 'sum' },
          { name: 'Время оконч.' }
        ]
      },
      { columns: [
          { name: 'Поз.в заявке, шт', total: 'avg' },
          { name: 'Цена поз.,р', total: 'avg' }
      ]},
      { columns: [
          { name: 'затр. на поз,р', total: 'avg' },
          { name: 'Глуб.поз.', total: 'avg' }
      ]},
      { columns: [
          { name: 'Стоим.упак,р', total: 'avg' }
      ]},
      { columns: [
          { name: 'Кол-во наимен.,шт', total: 'avg' },
          { name: 'Уров.претен.%', total: 'avg' }
      ]},
      { columns: [
          { name: 'Стоим.кубом.,р', total: 'avg' },
          { name: 'Объем загруз.%', total: 'avg' }
      ]},
      { columns: [
          { name: 'НТЗ', total: 'avg' },
          { name: 'Поз. на сотрудн.', total: 'avg' }
      ]}
    ]
  },
  {
    caption: 'Экран контроля поставок',
    path: 'report',
    name: 'gdlivedeliverystat'
  },
  {
    caption: 'Продажи по Apteka.ru',
    path: 'report',
    name: 'apteka24'
  }
]

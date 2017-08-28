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
              // По значению первого столбца всегда строится график
            caption: 'Факт', // Отображаемый заголовок столбца (необязательный)
            total: '', // Что отображать в итогах (необязательный):
              // sum - сумму по стобцу
              // avg - среднее по столбцу
              // В других случаях итог по столбцу не выводится
            decimals: 0 // Количество разрядов после запятой
          },
          {
            name: 'План,млн.р',
            type: '', // Тип столбца (необязательный)
              // Если указан тип = 'percent' или 'part', то автоматически добавляется третий столбец,
              // в котором отображается:
              // для 'percent' - процентное отношение значения первого столбца к значению второго
              // для 'part' - отношение значения первого столбца к значению второго (доля)
              // это отношение используется для определения цвета строки.
              // Если тип не указан, то для определения цвета строки
              // используется значение второго столбца
            total: '',
            decimals: 0 // Количество разрядов после запятой
          }
        ]
      },
      {
        columns: [
          { name: 'Выполн.%', total: 'avg', decimals: 0 },
          { name: 'Выпол. Год, %', type: '', total: '', decimals: 0 }
        ]
      },
      {
        columns: [
          { name: 'Вып.Кварт, %', total: 'avg', decimals: 0 },
          { name: 'Выпол. Год, %', type: '', total: '', decimals: 0 }
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
          { name: 'РН.млн.р', total: 'sum' }
        ]
      },
      {
        columns: [
          { name: 'ДЗ,млн.р', total: 'sum' },
          { name: 'ДЗ,%проср', total: 'avg', decimals: 0 } ]
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
        columns: [ { name: 'В пути,мл.р', total: 'sum' }, { name: 'В пути,дн', decimals: 0 } ]
      },
      {
        columns: [ { name: 'Резерв,дн', decimals: 1 }, { name: 'В пути,дн', total: 'avg' } ]
      },
      {
        columns: [ { name: 'На скл,млн.р', total: 'sum' }, { name: 'На скл,дн', total: 'avg' } ]
      },
      {
        columns: [ { name: 'Фин.цикл,дн', total: 'avg' } ]
      },
      {
        columns: [ { name: 'Население,млн.', total: 'sum' }, { name: 'ТС,млн.р' } ]
      },
      {
        columns: [ { name: 'УП(1000ч.)' }, { name: 'Доля филиала', decimals: 0 } ]
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
    name: 'gdlivedeliverystat',
    uri: 'livedeliverystat2',
    fixedColumn: 'Менеджер ОП',
    screens: [
      { columns: [
          { name: 'ТО, млн. руб.', total: 'sum' },
          { name: '% ЭСП', type: '', total: 'sum' }
      ]},
      { columns: [
          { name: 'Кол-во позиций', total: 'avg' },
          { name: 'ОТЗ, к.дн.', total: 'avg' }
      ]},
      { columns: [
          { name: 'Дельта ФЦ, к.дн.', total: 'avg' },
          { name: '% инв.', total: 'avg' }
      ]},
      { columns: [
          { name: '% ККС', total: 'avg' },
          { name: '% НКС', total: 'avg' }
      ]}
    ]
  },
  {
    caption: 'Продажи по Apteka.ru',
    path: 'report',
    name: 'apteka24',
    uri: 'sgd_inetapteka',
    fixedColumn: 'Филиал',
    screens: [
      { columns: [
        { name: 'Апт.с заказ', total: 'sum' },
        { name: 'Подкл.апт', type: 'percent', total: 'sum' }
      ]},
      { columns: [
        { name: 'Заказов', type: 'percent', total: 'sum' }
      ]},
      { columns: [
        { name: '%Возвраты', total: 'avg' }
      ]},
      { columns: [
        { name: '%апт.нац.', total: 'avg' }
      ]},
      { columns: [
        { name: 'Заказ/млн.насел', total: 'avg' }
      ]},
      { columns: [
        { name: 'Аптек/млн.насел', total: 'avg' }
      ]},
      { columns: [
        { name: 'Заказов на апт. в день', total: 'avg' },
        { name: 'Заказов', total: 'sum' }
      ]},
      { columns: [
        { name: 'Повторн.заказ', total: 'sum' },
        { name: 'Заказов', type: 'percent', total: 'sum' }
      ]},
      { columns: [
        { name: 'Сред.чек', total: 'avg' },
        { name: 'Продаж,тыс.р.', total: 'sum' }
      ]},
      { columns: [
        { name: 'РН,тыс.р.', total: 'sum' },
        { name: '%РН', total: 'avg' }
      ]},
      { columns: [
        { name: 'Приб.апт,тыс.р.', total: 'sum' },
        { name: 'Продаж,тыс.р.', type: 'percent', total: 'sum' }
      ]},
      { columns: [
        { name: 'Заказов', total: 'sum' },
        { name: 'Насел.млн.ч.', type: 'part', total: 'sum' }
      ]},
      { columns: [
        { name: 'Подкл.апт', total: 'sum' },
        { name: 'Насел.млн.ч.', type: 'part', total: 'sum' }
      ]},
      { columns: [
        { name: 'РН,тыс.р.', total: 'sum' },
        { name: 'РН на душу насел.', type: 'part', total: 'sum' }
      ]}
    ]
  }
]

function normalizeData(d) {
  return {
    category: d.Categoria,
    amount: Math.abs(+d.Importe.replace(",", ".")),
    type: d.Tipo.toLowerCase(),
    subcategory: d.Subcategoria,
    date: d.Fecha,
    description: d.Descripcion,
    overall: d.Overall
  };
}

function filterData(data, filterFunc) {
  return data.filter(filterFunc);
}

const isRelevantCategory = (d) =>
  !["transferencia", "transferencias"].includes(d.category.toLowerCase());

const isExpense = (d) => d.type === "gasto";

const subCategoryNotEmpty = (d) => d.subcategory !== "" && d.subcategory !== 'Unknown';

const isNotInvestment = (d) => d.category.toLowerCase() !== "inversiones";

function rollupAndSort(data, groupByProperty, resultProperty) {
  return Array.from(
    d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.amount),
      (d) => d[groupByProperty]
    )
  )
    .map(([key, value]) => ({ [resultProperty]: key, amount: value }))
    .sort((a, b) => b.amount - a.amount);
}

function calculateStatistics(amounts) {
  const sortedAmounts = [...amounts].sort((a, b) => a - b);
  const length = amounts.length;
  const mean = amounts.reduce((acc, val) => acc + val, 0) / length;

  // Calculating median
  const mid = Math.floor(length / 2);
  const median =
    length % 2 !== 0
      ? sortedAmounts[mid]
      : (sortedAmounts[mid - 1] + sortedAmounts[mid]) / 2;

  // Calculating mode more efficiently
  const frequencyMap = amounts.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  let maxFrequency = 0;
  let mode;
  for (const key in frequencyMap) {
    if (frequencyMap[key] > maxFrequency) {
      maxFrequency = frequencyMap[key];
      mode = key;
    }
  }

  // Calculating variance and standard deviation
  const variance =
    amounts.reduce((acc, val) => acc + (val - mean) ** 2, 0) / length;
  const stdDev = Math.sqrt(variance);

  // Getting min, max, and range
  const min = sortedAmounts[0];
  const max = sortedAmounts[length - 1];
  const range = max - min;

  return {
    mean,
    median,
    mode: Number(mode),
    stdDev,
    variance,
    range,
    min,
    max,
  };
}

function displayStatistics(stats) {
  const statsContainer = document.getElementById("statistics");
  statsContainer.innerHTML = `
<p>Media: ${stats.mean.toFixed(2)}</p>
<p>Mediana: ${stats.median.toFixed(2)}</p>
<p>Moda: ${stats.mode.toFixed(2)}</p>
<p>Desviación Estándar: ${stats.stdDev.toFixed(2)}</p>
<p>Varianza: ${stats.variance.toFixed(2)}</p>
<p>Rango: ${stats.range.toFixed(2)}</p>
<p>Mínimo: ${stats.min.toFixed(2)}</p>
<p>Máximo: ${stats.max.toFixed(2)}</p>
`;
}

function analyzeCohorts(data) {
  const cohorts = data.reduce((acc, d) => {
    const date = new Date(d.date);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = { total: 0, count: 0 };
    }

    acc[monthYear].total += parseFloat(d.amount);
    acc[monthYear].count++;

    return acc;
  }, {});

  createCohortChart(cohorts);
}

function analyzeYearOverYear(data) {
  const yearlyData = data.reduce((acc, d) => {
    const date = new Date(d.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!acc[year]) {
      acc[year] = Array(12).fill(0);
    }

    acc[year][month] += parseFloat(d.amount);
    return acc;
  }, {});

  createComparisonChart(yearlyData);
}

function aggregateByOverall(data) {
    const aggregatedData = {};

    data.forEach(d => {
        if (d.overall.toLowerCase() !== "unknown") {
          const amount = parseFloat(d.amount);
          // Sumar o inicializar el importe en la categoría correspondiente
          if (d.overall in aggregatedData) {
            aggregatedData[d.overall] += amount;
          } else {
            aggregatedData[d.overall] = amount;
          }
        }
    });

    const labels = Object.keys(aggregatedData);
    const amounts = Object.values(aggregatedData);

    return { labels, amounts };
}


function addOptionsToDropdown(selectElement, options) {
  options.forEach((option) => {
    selectElement.options[selectElement.options.length] = new Option(
      option,
      option
    );
  });
}

function getUniqueSortedYears(data) {
  const years = new Set();
  data.forEach((d) => {
    const date = new Date(d.date);
    years.add(date.getFullYear());
  });
  return Array.from(years).sort((a, b) => a - b);
}

function getUniqueSortedMonths(data) {
  const months = new Set();
  data.forEach((d) => {
    const date = new Date(d.date);
    months.add(date.getMonth() + 1);
  });
  return Array.from(months).sort((a, b) => a - b);
}

function getUniqueCategories(data) {
  const categoriesSet = new Set(data.map((item) => item.category));
  return Array.from(categoriesSet).sort();
}

function getUniqueSubCategories(data) {
  const subCategoriesSet = new Set(data.map((item) => item.subcategory));
  return Array.from(subCategoriesSet).sort();
}

function populateDropdowns(data) {
  const yearSelect = document.getElementById("year-select");
  const monthSelect = document.getElementById("month-select");

  const years = getUniqueSortedYears(data);
  const months = getUniqueSortedMonths(data);

  addOptionsToDropdown(yearSelect, years);
  addOptionsToDropdown(monthSelect, months);
}

function populateDropdownCategories(data) {
  const categorySelect = document.getElementById("category-select");
  const subCategorySelect = document.getElementById("subcategory-select");

  const categories = getUniqueCategories(data);
  const subCategories = getUniqueSubCategories(data);

  addOptionsToDropdown(categorySelect, categories);
  addOptionsToDropdown(subCategorySelect, subCategories);
}

function filterDataByDate(data, year, month) {
  return data.filter((d) => {
    const date = new Date(d.date);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

function filterDataByProperty(data, value, property) {
  return data.filter((d) => {
    return d[property] === value;
  });
}

function groupDataByCategory(data) {
  const groupedData = {};

  data.forEach((d) => {
    const amount = parseFloat(d.amount);
    groupedData[d.category] = (groupedData[d.category] || 0) + amount;
  });

  return groupedData;
}

function groupDataByPropertyOverTime(data, property) {
  const groupedData = {};

  data.forEach((d) => {
    const amount = parseFloat(d.amount);
    const date = new Date(d.date);
    const month = date.getMonth() + 1; // Los meses en JavaScript empiezan en 0
    const year = date.getFullYear();
    const key = `${d[property]}-${year}-${month}`;

    if (!groupedData[key]) {
      groupedData[key] = {
        amount: 0,
        year: year,
        month: month,
        property: d[property],
      };
    }

    groupedData[key].amount += amount;
  });

  return groupedData;
}

function filterAndGroupData(data, year, month) {
  const filteredData = filterDataByDate(data, year, month);
  return groupDataByCategory(filteredData);
}

function filterAndGroupDataByProperty(data, value, property) {
  const filteredData = filterDataByProperty(data, value, property);
  return groupDataByPropertyOverTime(filteredData, property);
}

function calculateVariance(arr) {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
}

function isDateInRange(date, startDate, endDate) {
  return date >= startDate && date < endDate;
}

function filterLastMonthData(data) {
  const today = new Date();
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return data.filter((d) =>
    isDateInRange(new Date(d.date), lastMonthStart, currentMonthStart)
  );
}

function filterLastCompleteYearData(data) {
  const today = new Date();
  const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
  const currentYearStart = new Date(today.getFullYear(), 0, 1);

  return data.filter((d) =>
    isDateInRange(new Date(d.date), lastYearStart, currentYearStart)
  );
}

function sumExpensesByProperty(data, property) {
    return data.reduce((acc, d) => {
        const key = d[property];
        acc[key] = (acc[key] || 0) + d.amount;
        return acc;
    }, {});
}

function sumExpensesByCategory(data) {
    return sumExpensesByProperty(data, 'category');
}

function sumExpensesBySubcategory(data) {
    return sumExpensesByProperty(data, 'subcategory');
}


// needs more work
// function identifyRecurringExpenses(data) {
//   const expenseCount = {};
//   const recurringExpenses = [];
//   const someThreshold = 1000;

//   data.forEach((d) => {
//     const key = `${d.category}-${d.description}`;
//     if (!expenseCount[key]) {
//       expenseCount[key] = { count: 1, amounts: [parseFloat(d.amount)] };
//     } else {
//       expenseCount[key].count++;
//       expenseCount[key].amounts.push(parseFloat(d.amount));
//     }
//   });

//   for (const key in expenseCount) {
//     if (expenseCount[key].count > 1) {
//       const variance = calculateVariance(expenseCount[key].amounts);
//       if (variance < someThreshold) {
//         // Establecer un umbral de variación para identificar gastos regulares
//         recurringExpenses.push(key);
//       }
//     }
//   }

//   return recurringExpenses;
// }

// function updateRecurringExpensesList(recurringExpenses) {
//   const list = document.getElementById("recurring-expenses-list");
//   list.innerHTML = "";
//   recurringExpenses.forEach((expense) => {
//     const listItem = `<li>${expense}</li>`;
//     list.innerHTML += listItem;
//   });
// }

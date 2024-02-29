// Default colors for the pie chart
const defaultColors = [
  "#a66d93", "#82a798", "#7db3b1", "#966f75", "#9b65b1",
  "#677d74", "#a072a7", "#736f6a", "#718e8f", "#849c71",
  "#6cb18b", "#8e838e", "#6697a9", "#6f75ac", "#a599a5",
  "#749899", "#90af8f", "#75a896", "#9d9b80", "#797797",
  "#9766ab", "#b3a590", "#a17689", "#749f70", "#a4a28b",
  "#808aae", "#75779a", "#8c999b", "#8b6b8d", "#85a866",
  "#6b96aa", "#73a078", "#8a8496", "#78a267", "#a17a90",
  "#9fa0ac", "#846993", "#7b8fa3", "#8a9bb2", "#83a987",
];



function getPieChartConfig(categories, amounts, colors = defaultColors) {
  return {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      legend: { position: "top" },
      title: { display: false },
      animation: { animateScale: true, animateRotate: true },
    },
  };
}

function createPieChart(categories, amounts, htmlId) {
  const canvasContext = document.getElementById(htmlId).getContext("2d");
  const chartConfig = getPieChartConfig(categories, amounts);
  new Chart(canvasContext, chartConfig);
}

function createCohortChart(cohorts) {
  const ctx = document.getElementById("cohortChart").getContext("2d");
  const chartData = {
    labels: Object.keys(cohorts),
    datasets: [
      {
        label: "Gasto Total por Cohorte",
        data: Object.values(cohorts).map((cohort) => cohort.total),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function createComparisonChart(yearlyData) {
  const ctx = document.getElementById("comparisonChart").getContext("2d");
  const chartData = {
    labels: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    datasets: Object.keys(yearlyData).map((year) => ({
      label: `Año ${year}`,
      data: yearlyData[year],
      fill: false,
      borderColor: randomColor(),
      tension: 0.1,
    })),
  };

  new Chart(ctx, {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Comparación de Gastos Año a Año",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

function randomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getBarChartConfig(
  categories,
  expenses,
  colors = defaultColors,
  borderColor = "rgba(0, 123, 255, 1)"
) {
  return {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Gasto Total por Categoría",
          data: expenses,
          backgroundColor: colors,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
}

function createBarChart(categories, expenses, canvasId) {
  const canvasContext = document.getElementById(canvasId).getContext("2d");
  const chartConfig = getBarChartConfig(categories, expenses);
  new Chart(canvasContext, chartConfig);
}

function getLineChartConfig(labels, datasets) {
  return {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      legend: { position: 'top' },
      title: { display: false },
      animation: { animateScale: true, animateRotate: true },
    },
  };
}

let currentChart = null;
function createLineChart(data, htmlId) {
  const datasets = [];
  const years = new Set(Object.values(data).map(item => item.year));
  
  years.forEach((year, index) => {
    const yearData = Object.values(data).filter(item => item.year === year);
    const amounts = new Array(12).fill(0); // Preparar array para 12 meses

    yearData.forEach(item => {
      amounts[item.month - 1] = item.amount; // -1 porque los meses en JavaScript comienzan en 0
    });

    datasets.push({
      label: `Año ${year}`,
      data: amounts,
      borderColor: defaultColors[index % defaultColors.length],
      fill: false,
    });
  });

  if (currentChart) {
    currentChart.destroy();
  }

  // Configurar y crear el gráfico
  const chartConfig = getLineChartConfig(["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], datasets);
  const canvasContext = document.getElementById(htmlId).getContext("2d");
  currentChart = new Chart(canvasContext, chartConfig);
}

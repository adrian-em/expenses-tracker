function fillTableGeneric(data, tbodyId, dataProperty) {
  const tbody = document.getElementById(tbodyId);
  const rows = data.map(
    (d) => `<tr><td>${d[dataProperty]}</td><td>${d.amount.toFixed(2)}</td></tr>`
  );
  tbody.innerHTML = rows.join("");
}

function fillTableWithData(data, tableId) {
  const tableBody = document
    .getElementById(tableId)
    .getElementsByTagName("tbody")[0];
  Object.keys(data).forEach((key) => {
    const row = tableBody.insertRow();
    row.innerHTML = `<td>${key}</td><td>${data[key].toFixed(2)}</td>`;
  });
}

function processExpenses(
  filteredData,
  filterFunction,
  sumFunction,
  tableId,
  chartId
) {
  const filtered = filterFunction(filteredData);
  const summedExpenses = sumFunction(filtered);

  fillTableWithData(summedExpenses, tableId);
  createBarChart(
    Object.keys(summedExpenses),
    Object.values(summedExpenses),
    chartId
  );
}

function updateFilteredTable(groupedData) {
  const tbody = document.getElementById("filtered-data-body");
  tbody.innerHTML = "";
  for (const category in groupedData) {
    const amount = groupedData[category].toFixed(2);
    const row = `<tr><td>${category}</td><td>${amount}</td></tr>`;
    tbody.innerHTML += row;
  }
}

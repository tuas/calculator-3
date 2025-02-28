document.getElementById('calculate-btn').addEventListener('click', calculateCost);
document.getElementById('download-btn').addEventListener('click', downloadTable);
document.getElementById('upload-btn').addEventListener('click', () => document.getElementById('upload-file').click());
document.getElementById('upload-file').addEventListener('change', uploadTable);

let results = [];

function calculateCost() {
    const filamentCost = parseFloat(document.getElementById('filament-cost').value);
    const powerCost = parseFloat(document.getElementById('power-cost').value);
    const machineWear = parseFloat(document.getElementById('machine-wear').value);
    const printTime = parseFloat(document.getElementById('print-time').value);
    const printWeight = parseFloat(document.getElementById('print-weight').value);
    const powerConsumption = parseFloat(document.getElementById('power-consumption').value);
    const profitFactor = parseFloat(document.getElementById('profit-factor').value);

    const filamentCostTotal = (printWeight / 1000) * filamentCost;
    const powerCostTotal = (powerConsumption / 1000) * printTime * powerCost;
    const machineWearTotal = machineWear * printTime;

    const totalCost = (filamentCostTotal + powerCostTotal + machineWearTotal) * profitFactor;

    const fileName = `Impresión_${results.length + 1}`;
    const date = new Date().toLocaleDateString();

    results.push({ fileName, date, totalCost });
    updateTable();
}

function updateTable() {
    const tbody = document.querySelector('#results-table tbody');
    tbody.innerHTML = '';

    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.fileName}</td>
            <td>${result.date}</td>
            <td>$${result.totalCost.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

function downloadTable() {
    const dataStr = JSON.stringify(results);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculadora_impresiones.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function uploadTable(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataStr = e.target.result;
            results = JSON.parse(dataStr);
            updateTable();
        };
        reader.readAsText(file);
    }
}

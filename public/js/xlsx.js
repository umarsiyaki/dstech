// Sample data (In real implementation, fetch this data from your server)
const exportData = [
    { id: 1, name: 'iPhone 13', type: 'Product', price: 999 },
    { id: 2, name: 'Order #12345', type: 'Order', total: 300 },
    { id: 3, name: 'John Doe', type: 'User', email: 'john@example.com' },
];

// Function to export data as CSV
function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Type,Price/Total/Email\n"; // CSV header

    exportData.forEach(item => {
        let row = `${item.id},${item.name},${item.type},${item.price || item.total || item.email}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_export.csv");
    document.body.appendChild(link);
    link.click();
}

// Function to export data as Excel (using a third-party library)
function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
    XLSX.writeFile(workbook, "data_export.xlsx");
}

// Add event listeners for export buttons
document.getElementById('exportCSV').addEventListener('click', exportCSV);
document.getElementById('exportExcel').addEventListener('click', exportExcel);

// Function to import data from a file
function importData() {
    const fileInput = document.getElementById('fileInput').files[0];
    
    if (!fileInput) {
        alert('Please select a file to import.');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const fileData = event.target.result;

        // Determine file type (CSV or Excel)
        const fileType = fileInput.name.split('.').pop().toLowerCase();

        if (fileType === 'csv') {
            importCSV(fileData);
        } else if (fileType === 'xlsx') {
            importExcel(fileData);
        } else {
            alert('Invalid file format. Please upload a CSV or Excel file.');
        }
    };

    reader.readAsBinaryString(fileInput);
}

// Function to process imported CSV data
function importCSV(csvData) {
    const rows = csvData.split('\n').slice(1); // Remove header
    const importedData = rows.map(row => {
        const [id, name, type, value] = row.split(',');
        return { id, name, type, value };
    });

    console.log('Imported CSV Data:', importedData);
    alert('Data imported successfully.');
}

// Function to process imported Excel data (using xlsx.js)
function importExcel(fileData) {
    const workbook = XLSX.read(fileData, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log('Imported Excel Data:', sheet);
    alert('Data imported successfully.');
}

function createtablefromdata() {
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = ''; // Clear the container before adding new content
    
    if (!data || data.length === 0) {
        tableContainer.innerHTML = 'Error loading data. Is this a valid JSON?';
        return;
    }

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    // Determine the key to use for the "record" column
    const keys = Object.keys(data[0]);
    const recordKey = keys.includes('id') ? 'id' : keys[0];

    // Populate the body rows
    data.forEach(item => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');

        // Create a div to wrap the record entry
        const recordDiv = document.createElement('div');
        recordDiv.classList.add('data-record');
        recordDiv.textContent = item[recordKey];
        
        // Add click event listener to each record
        recordDiv.addEventListener('click', () => {
            populateDetailsPanel(item);
        });

        cell.appendChild(recordDiv);
        row.appendChild(cell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

function createRow(record, key, tbody) {
    const row = document.createElement('tr');
    
    const keyCell = document.createElement('td');
    keyCell.style.position = 'relative';

    // Handle 'id' key separately to display as text
    if (key === 'id') {
        keyCell.textContent = key;
        keyCell.style.fontWeight = 'normal'; // Ensure id key is not bold
    } else {
        const keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.value = key;
        keyInput.addEventListener('change', function() {
            updateRecordKey(record, key, keyInput.value);
        });
        keyCell.appendChild(keyInput);
    }

    const valueCell = document.createElement('td');
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.value = record[key];
    valueInput.addEventListener('change', function() {
        updateRecordValue(record, key, valueInput.value);
    });
    valueCell.appendChild(valueInput);

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    tbody.appendChild(row);
}
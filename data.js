let data = {};

document.getElementById('jsoninput').addEventListener('change', async function(event) {
    const file = event.target.files[0]; // Get the selected file
    try {
        data = await readjson(file); // Read and parse the JSON file
        
        // Check for the 'id' field in the first record
        if (!data[0].hasOwnProperty('id')) {
            throw new Error("The JSON data must contain an 'id' field.");
        }

        // Ensure each record has a 'links' field
        data.forEach(record => {
            if (!record.hasOwnProperty('links')) {
                record.links = [];
            }
        });

        console.log("data loaded");
        document.getElementById('dataview').classList.add('hidden');
        document.getElementById('listview').classList.remove('hidden');
        document.getElementById('data-info-section').innerText = "Your data has been loaded, if you load the data again, you will lose any changes you've made to these data";
        
        createtablefromdata();
    } catch (error) {
        console.error(error); // Handle any errors
        displayError(error.message); // Display the error message
    }
});

function addNewRecord() {
    const baseId = 'new-id';
    const uniqueId = generateUniqueId(baseId);
    
    // Get the size of the SVG container
    const svgWidth = document.getElementById('graph-container').offsetWidth;
    const svgHeight = document.getElementById('graph-container').offsetHeight;

    // Generate random fx and fy values near the upper left portion with minimum 100
     // Generate random fx and fy values near the upper left portion with minimum 100
     const fx = Math.floor(Math.random() * (svgWidth / 4)) + 100; // Minimum 100, restricted to the left quarter
     const fy = Math.floor(Math.random() * (svgHeight / 4)) + 100; // Minimum 100, restricted to the upper quarter
 
    const newRecord = { id: uniqueId, links: [], fx, fy }; // Initialize new record with unique id, links, and position

    insertCommonKeys(newRecord); // Insert common keys into the new record

    data.push(newRecord);

    // Check the current visible view and update it
    if (!document.getElementById('listview').classList.contains('hidden')) {
        createtablefromdata(); // Refresh the list view to include the new record
    } else if (!document.getElementById('treeview').classList.contains('hidden')) {
        loadgraph(data); // Refresh the tree view to include the new node
    }

    populateDetailsPanel(newRecord); // Populate the details panel with the new record for editing
}

function updateRecordKey(record, oldKey, newKey) {
    if (newKey === null || newKey.trim() === '') {
        delete record[oldKey];
        populateDetailsPanel(record); // Refresh the details panel to reflect changes
    } else if (oldKey !== newKey) {
        Object.defineProperty(record, newKey,
            Object.getOwnPropertyDescriptor(record, oldKey));
        delete record[oldKey];
        if (oldKey === 'id') {
            createtablefromdata(); // Refresh the table on the left to reflect changes
        }
        updateData(record);
    }
}

function updateRecordValue(record, key, newValue) {
    if (newValue === null || newValue.trim() === '') {
        delete record[key];
        populateDetailsPanel(record); // Refresh the details panel to reflect changes
    } else {
        if (key === 'id') {
            newValue = generateUniqueId(newValue); // Ensure the new id is unique

            // Update the record's ID in the data array
            const recordIndex = data.findIndex(item => item.id === record.id);
            if (recordIndex !== -1) {
                data[recordIndex].id = newValue;
            }

            // Update the record's ID
            record.id = newValue;
            createtablefromdata(); // Refresh the table on the left to reflect changes
            populateDetailsPanel(record); // Refresh the details panel to reflect changes
        } else {
            record[key] = newValue;
        }

        updateData(record);
    }
}

function updateData(updatedRecord, oldId) {
    const index = data.findIndex(record => record.id === oldId);
    if (index !== -1) {
        data[index] = updatedRecord;
    }

    // Update links in all records
    data.forEach(record => {
        record.links.forEach(link => {
            if (link.target === oldId) {
                link.target = updatedRecord.id;
            }
        });
    });

    let datasec = document.getElementById("dataview");
    let listsec = document.getElementById("listview");
    let treesec = document.getElementById("treeview");
    let groupsec = document.getElementById("groupview");

    if (listsec && !listsec.classList.contains('hidden')) {
        createtablefromdata();
    }

    // Update treeview labels if needed
    if (treesec && !treesec.classList.contains('hidden')) {
        const currentNodeIds = getCurrentGraphNodeIds();
        const filteredData = data.filter(record => currentNodeIds.includes(record.id));
        loadgraph(filteredData);
    }
}

function activateListSearch() {
    const listSearchInput = document.getElementById('list-search');
    if (listSearchInput) {
        listSearchInput.focus();
        listSearchInput.select();
    }
}

function removeGroup(index, record) {
    record.groups.splice(index, 1);
    updateData(record);
    populateDetailsPanel(record); // Refresh the details panel to show the updated groups
}


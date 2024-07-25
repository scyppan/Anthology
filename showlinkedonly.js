let toggleLinkedCheckbox = document.createElement('input');
toggleLinkedCheckbox.type = 'checkbox';
toggleLinkedCheckbox.id = 'toggle-linked';
toggleLinkedCheckbox.classList.add('hidden'); // Hide initially

let toggleLinkedLabel = document.createElement('label');
toggleLinkedLabel.htmlFor = 'toggle-linked';
toggleLinkedLabel.classList.add('linked-checkbox-label', 'hidden'); // Hide initially
toggleLinkedLabel.textContent = ' Show only linked';
toggleLinkedLabel.prepend(toggleLinkedCheckbox);

// Add to the details panel
const detailsPanel = document.getElementById('details-panel');
detailsPanel.appendChild(toggleLinkedLabel);

document.getElementById('toggle-linked').addEventListener('change', function() {
    const currentRecordId = document.getElementById('nodeName').dataset.nodeId;
    const currentRecord = data.find(record => record.id === currentRecordId);

    if (this.checked && currentRecord) {
        showLinkedEntities(currentRecord);
    } else {
        resetViews();
    }

    const groupView = document.getElementById('groupview');

    if (groupView && !groupView.classList.contains('hidden')) {
        if (this.checked && currentRecord) {
            updateGroupView(currentRecord);
        } else {
            displayAllGroups(); // Function to display all groups when checkbox is unchecked
        }
    }

});

function showLinkedEntities(record) {
    const linkedFromRecords = record.links.map(link => data.find(item => item.id === link.target)).filter(item => item);
    const linkedToRecords = data.filter(item => item.links.some(link => link.target === record.id));
    const linkedRecords = [...new Set([record, ...linkedFromRecords, ...linkedToRecords])];

    // Determine the current active view and update it
    if (!document.getElementById('listview').classList.contains('hidden')) {
        showLinkedRecordsList(linkedRecords);
    } else if (!document.getElementById('treeview').classList.contains('hidden')) {
        loadgraph(linkedRecords);
    } else if (!document.getElementById('groupview').classList.contains('hidden')) {
        showLinkedGroups(linkedRecords);
    }
}

function resetViews() {
    if (!document.getElementById('listview').classList.contains('hidden')) {
        createtablefromdata(); // Reload the full list view
    } else if (!document.getElementById('treeview').classList.contains('hidden')) {
        loadgraph(data); // Reload the full tree view
    } else if (!document.getElementById('groupview').classList.contains('hidden')) {
        displayAllGroups(); // Reload all groups
    }
}

function showLinkedRecordsList(linkedRecords) {
    createTableFromSearchResults(linkedRecords); // Function to display search results
}

function showLinkedGroups(linkedRecords) {
    const linkedGroups = new Set();
    linkedRecords.forEach(item => {
        if (item.groups) {
            item.groups.forEach(group => linkedGroups.add(group));
        }
    });
    loadGroups(Array.from(linkedGroups)); // Display the linked groups
}

function getLinkedRecords(record) {

    console.log(record);

    const linkedFromRecords = record.links.map(link => data.find(item => item.id === link.target)).filter(item => item);
    const linkedToRecords = data.filter(item => item.links.some(link => link.target === record.id));
    return [...new Set([record, ...linkedFromRecords, ...linkedToRecords])];
}

function getLinkedGroups(linkedRecords) {
    const linkedGroups = new Set();
    linkedRecords.forEach(item => {
        if (item.groups) {
            item.groups.forEach(group => linkedGroups.add(group));
        }
    });
    return Array.from(linkedGroups);
}
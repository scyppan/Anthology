let selectedRecordId;

document.getElementById('add-record-btn').addEventListener('click', addNewRecord);

function addNewKeyValuePair(record, tbody) {
    if (!tbody) {
        console.error('Error: tbody is undefined');
        return;
    }
    
    const newRow = document.createElement('tr');

    const keyCell = document.createElement('td');
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.placeholder = 'New key';
    keyCell.appendChild(keyInput);

    const valueCell = document.createElement('td');
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'New value';
    valueInput.addEventListener('change', function() {
        if (keyInput.value.trim() !== '') {
            record[keyInput.value] = valueInput.value;
            updateData(record);
            populateDetailsPanel(record); // Refresh the details panel to show the new key-value pair
        }
    });
    valueCell.appendChild(valueInput);

    newRow.appendChild(keyCell);
    newRow.appendChild(valueCell);
    tbody.appendChild(newRow);
    keyInput.focus();
}

function deleteRecord(record) {
    const confirmation = confirm('Are you sure you want to delete this record?');
    if (!confirmation) {
        return; // Exit if user cancels
    }

    const recordId = record.id;
    const recordIndex = data.findIndex(item => item.id === recordId);

    if (recordIndex !== -1) {
        // Remove the record
        data.splice(recordIndex, 1);

        // Remove all links to and from the record
        data.forEach(item => {
            item.links = item.links.filter(link => link.target !== recordId);
        });

        // Refresh the table and clear the details panel
        createtablefromdata();
        document.getElementById('details-panel').innerHTML = 'Record deleted.';
        toggleLinkedLabel.classList.add('hidden');
        toggleLinkedCheckbox.classList.add('hidden');

        // Update the graph to reflect the deletion and link removals
        loadgraph(data);
    }
    console.log("Record deleted:", data);
}

function addLink(record) {
    console.log('addLink function executed'); // Log function execution
    const linksContainer = document.getElementById('links-container');
    console.log('linksContainer:', linksContainer); // Log the container

    const index = record.links.length;
    console.log('New link index:', index); // Log the new index

    const linkDiv = document.createElement('div');
    linkDiv.className = 'link-entry';
    linkDiv.innerHTML = `
        <button type="button" onclick="startLinkMode(${index})">🔗</button>
        <select class="link-type">
            <option value="solid">solid</option>
            <option value="thick">thick</option>
            <option value="dotted">dotted</option>
            <option value="dashed">dashed</option>
        </select>
        <button type="button" onclick="removeLink(${index}, this)">⊖</button>
    `;
    linksContainer.appendChild(linkDiv);
    console.log('linkDiv appended:', linkDiv); // Log the appended div

    record.links.push({ target: '', type: 'solid' });
    console.log('Updated record links:', record.links); // Log the updated links

    // Add event listeners to the new input fields
    const typeSelect = linkDiv.querySelector('.link-type');
    console.log('typeSelect:', typeSelect); // Log the type select

    typeSelect.addEventListener('change', function() {
        console.log('Type select changed'); // Log select change
        record.links[index].type = typeSelect.value;
        updateData(record); // Update data to reflect changes
    });

    // Log the current state of the links container
    console.log('Current links container HTML:', linksContainer.innerHTML);
}

function removeLink(index, button) {
    console.log('removeLink function executed'); // Log function execution
    const linksContainer = document.getElementById('links-container');
    const nodeNameElement = document.getElementById('nodeName');
    console.log('nodeNameElement:', nodeNameElement); // Log the nodeName element

    if (!nodeNameElement) {
        console.error('nodeName element is not found.');
        return;
    }

    const nodeId = nodeNameElement.dataset.nodeId;
    console.log('nodeId:', nodeId); // Log the nodeId

    const record = data.find(rec => rec.id === nodeId);
    console.log('record:', record); // Log the record

    if (!record) {
        console.error('Record not found.');
        return;
    }

    console.log('Removing link at index:', index); // Log the index
    record.links.splice(index, 1);
    linksContainer.removeChild(button.parentElement);
    updateData(record); // Update data to reflect changes

    // Update the tree view to reflect the link removal
    loadgraph(data);
}

function displayLinkedCharacters(record) {
    const listSearchInput = document.getElementById('list-search');
    const toggleLinkedCheckbox = document.getElementById('toggle-linked');

    if (!listSearchInput || !toggleLinkedCheckbox) {
        console.error('Error: list-search input or toggle-linked checkbox not found.');
        return;
    }

    if (toggleLinkedCheckbox.checked) { // Proceed only if the checkbox is checked
        const linkedFromRecords = record.links.map(link => data.find(item => item.id === link.target)).filter(item => item);
        const linkedToRecords = data.filter(item => item.links.some(link => link.target === record.id));
        const linkedRecords = [...new Set([...linkedFromRecords, ...linkedToRecords])];

        createTableFromSearchResults(linkedRecords); // Function to display search results
    }
}

function addGroup(record, groupTbody) {
    const groupRow = document.createElement('tr');

    // Group input
    const groupCell = document.createElement('td');
    const groupInput = document.createElement('input');
    groupInput.type = 'text';
    groupInput.placeholder = 'Group';
    groupInput.value = '';
    groupInput.addEventListener('change', function() {
        if (groupInput.value.trim() !== '') {
            const newGroup = {
                group: groupInput.value.trim(),
                role: '',
                priority: ''
            };
            record.groups.push(newGroup);
            updateData(record);
            //populateDetailsPanel(record); // Refresh the details panel to show the new group
            //activateListSearch(); // Activate search bar in list view
        } else {
            groupRow.remove();
        }
    });
    groupCell.appendChild(groupInput);
    groupRow.appendChild(groupCell);

    // Role input
    const roleCell = document.createElement('td');
    const roleInput = document.createElement('input');
    roleInput.type = 'text';
    roleInput.placeholder = 'Role';
    roleInput.value = '';
    roleInput.addEventListener('change', function() {
        const groupIndex = record.groups.findIndex(g => g.group === groupInput.value);
        if (groupIndex !== -1) {
            record.groups[groupIndex].role = roleInput.value.trim();
            updateData(record);
        }
    });
    roleCell.appendChild(roleInput);
    groupRow.appendChild(roleCell);

    // Priority input
    const priorityCell = document.createElement('td');
    const priorityInput = document.createElement('input');
    priorityInput.type = 'number';
    priorityInput.placeholder = 'Priority';
    priorityInput.value = '';
    priorityInput.addEventListener('change', function() {
        const groupIndex = record.groups.findIndex(g => g.group === groupInput.value);
        if (groupIndex !== -1) {
            const priorityValue = parseInt(priorityInput.value.trim(), 10);
            record.groups[groupIndex].priority = isNaN(priorityValue) ? '' : priorityValue;
            updateData(record);
        }
    });
    priorityCell.appendChild(priorityInput);
    groupRow.appendChild(priorityCell);

    // Delete button
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '⊖';
    deleteButton.addEventListener('click', function() {
        const groupIndex = record.groups.findIndex(g => g.group === groupInput.value);
        if (groupIndex !== -1) {
            record.groups.splice(groupIndex, 1);
            updateData(record);
            groupRow.remove();
        }
    });
    deleteCell.appendChild(deleteButton);
    groupRow.appendChild(deleteCell);

    groupTbody.appendChild(groupRow);
    groupInput.focus();
}

function populateDetailsPanel(record) {
    selectedRecord = record;

    // Ensure every record has fx and fy keys
    record.fx = record.fx || '';
    record.fy = record.fy || '';

    if (record.fx < 10) {
        record.fx = randbetween(10, 150);
    }
    if (record.fy < 10) {
        record.fy = randbetween(10, 150);
    }

    const detailsPanel = document.getElementById('details-panel');
    detailsPanel.innerHTML = ''; // Clear the details panel

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    // Add this block to handle id, fx, and fy at the top
    ['id', 'fx', 'fy'].forEach(key => {
        const row = document.createElement('tr');

        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        row.appendChild(keyCell);

        const valueCell = document.createElement('td');
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.value = record[key];
        valueInput.addEventListener('change', function () {
            const newValue = valueInput.value.trim();
            if (key === 'id') {
                const oldId = record.id;
                // Check if the new ID conflicts with existing records
                if (data.some(record => record.id === newValue && record.id !== oldId)) {
                    record.id = generateUniqueId(newValue); // Generate a unique ID if there's a conflict
                } else {
                    record.id = newValue; // Use the new value if there's no conflict
                }
                updateData(record, oldId); // Update data with oldId for reference
            } else {
                record[key] = newValue;
                updateData(record);
            }
            populateDetailsPanel(record); // Refresh the details panel to show the updated values
        });
        valueCell.appendChild(valueInput);
        row.appendChild(valueCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    detailsPanel.appendChild(table);

    // Populate other fields
    Object.keys(record).forEach(key => {
        if (key !== 'links' && key !== 'notes' && key !== 'groups' && key !== 'id' && key !== 'fx' && key !== 'fy') {
            createRow(record, key, tbody);
        }
    });

    detailsPanel.appendChild(table);

    // Ensure nodeName element exists
    const nodeNameInput = document.createElement('input');
    nodeNameInput.type = 'hidden';
    nodeNameInput.id = 'nodeName';
    nodeNameInput.dataset.nodeId = record.id;
    detailsPanel.appendChild(nodeNameInput);

    // Add the "Show only linked" checkbox
    const toggleLinkedContainer = document.createElement('div');
    toggleLinkedContainer.id = 'toggle-linked-container';

    // Append the global toggleLinkedLabel element to the container
    toggleLinkedContainer.appendChild(toggleLinkedLabel);
    detailsPanel.appendChild(toggleLinkedContainer);
    toggleLinkedLabel.classList.remove('hidden');
    toggleLinkedCheckbox.classList.remove('hidden');

    // Add event listener for the checkbox
    if (toggleLinkedCheckbox) {
        toggleLinkedCheckbox.addEventListener('change', function () {
            if (this.checked) {
                displayLinkedCharacters(record);
            } else {
                createtablefromdata(); // Re-display the full list when checkbox is unchecked
            }
        });
    }

    // Add a button to add a new key-value pair below the table and checkbox
    const addButton = document.createElement('button');
    addButton.textContent = 'Add new key-value pair';
    addButton.classList.add("btn");
    addButton.addEventListener('click', function () {
        addNewKeyValuePair(record, tbody);
    });
    detailsPanel.appendChild(addButton);

    // Add a section for links
    const linksContainer = document.createElement('div');
    linksContainer.id = 'links-container';
    linksContainer.innerHTML = '<h3>Links</h3>';
    record.links.forEach((link, index) => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'link-entry';
        linkDiv.innerHTML = `
            ${link.target ? `<span class="link-label" onclick="startLinkMode(${index})">${link.target}</span>` : `<button type="button" onclick="startLinkMode(${index})">🔗</button>`}
            <select class="link-type">
                <option value="solid"${link.type === 'solid' ? ' selected' : ''}>solid</option>
                <option value="thick"${link.type === 'thick' ? ' selected' : ''}>thick</option>
                <option value="dotted"${link.type === 'dotted' ? ' selected' : ''}>dotted</option>
                <option value="dashed"${link.type === 'dashed' ? ' selected' : ''}>dashed</option>
            </select>
            <button type="button" onclick="removeLink(${index}, this)">⊖</button>
        `;
        linksContainer.appendChild(linkDiv);

        // Attach event listeners to existing links
        const typeSelect = linkDiv.querySelector('.link-type');
        typeSelect.addEventListener('change', function () {
            record.links[index].type = typeSelect.value;
            updateData(record); // Update data to reflect changes
        });
    });
    detailsPanel.appendChild(linksContainer);

    const addLinkButton = document.createElement('button');
    addLinkButton.textContent = 'Add Link';
    addLinkButton.classList.add("btn");
    addLinkButton.addEventListener('click', function () {
        console.log('Add Link button clicked'); // Log click event
        addLink(record);
    });
    detailsPanel.appendChild(addLinkButton);

    // Add a section for groups with group, role, and priority inputs
    const groupsContainer = document.createElement('div');
    groupsContainer.id = 'groups-container';
    groupsContainer.innerHTML = '<h3>Groups</h3>';

    record.groups = record.groups || []; // Initialize groups if it doesn't exist
    const groupTable = document.createElement('table');
    const groupTbody = document.createElement('tbody');

    record.groups.forEach((groupEntry, index) => {
        const groupRow = document.createElement('tr');
        groupRow.classList.add('flex-row'); // Apply flexbox to the row
    
        // Group td and input
        const groupCell = document.createElement('td');
        groupCell.classList.add('group-td');
        groupCell.title = 'Group';
        const groupInput = document.createElement('input');
        groupInput.type = 'text';
        groupInput.value = groupEntry.group || '';
        groupInput.placeholder = 'Group';
        groupInput.addEventListener('change', function () {
            record.groups[index].group = groupInput.value.trim();
            updateData(record); // Update data to reflect changes
        });
        groupCell.appendChild(groupInput);
        groupRow.appendChild(groupCell);
    
        // Role td and input
        const roleCell = document.createElement('td');
        roleCell.classList.add('role-td');
        roleCell.title = 'Role';
        const roleInput = document.createElement('input');
        roleInput.type = 'text';
        roleInput.value = groupEntry.role || '';
        roleInput.placeholder = 'Role';
        roleInput.addEventListener('change', function () {
            record.groups[index].role = roleInput.value.trim();
            updateData(record); // Update data to reflect changes
        });
        roleCell.appendChild(roleInput);
        groupRow.appendChild(roleCell);
    
        // Priority td and input
        const priorityCell = document.createElement('td');
        priorityCell.classList.add('priority-td'); // Specific class for priority width
        const priorityInput = document.createElement('input');
        priorityInput.type = 'number';
        priorityInput.value = groupEntry.priority || '';
        priorityInput.placeholder = 'Priority';
        priorityInput.title = 'Priority';
        priorityInput.addEventListener('change', function () {
            const priorityValue = parseInt(priorityInput.value.trim(), 10);
            record.groups[index].priority = isNaN(priorityValue) ? '' : priorityValue;
            updateData(record); // Update data to reflect changes
        });
        priorityCell.appendChild(priorityInput);
        groupRow.appendChild(priorityCell);
    
        // Delete button
        const deleteCell = document.createElement('td');
        deleteCell.classList.add('delete-btn-td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '⊖';
        deleteButton.addEventListener('click', function () {
            removeGroup(index, record);
        });
        deleteCell.appendChild(deleteButton);
        groupRow.appendChild(deleteCell);
    
        groupTbody.appendChild(groupRow);
    });
    
    

    groupTable.appendChild(groupTbody);
    groupsContainer.appendChild(groupTable);

    const addGroupButton = document.createElement('button');
    addGroupButton.textContent = 'Add Group';
    addGroupButton.classList.add("btn");
    addGroupButton.addEventListener('click', function () {
        addGroup(record, groupTbody);
    });
    groupsContainer.appendChild(addGroupButton);

    detailsPanel.appendChild(groupsContainer);

    // Add a section for notes
    const notesContainer = document.createElement('div');
    notesContainer.id = 'notes-container';
    notesContainer.innerHTML = '<h3>Notes</h3>';

    const notesTextarea = document.createElement('textarea');
    notesTextarea.id = 'notes-textarea';
    notesTextarea.style.width = '100%';
    notesTextarea.style.height = '100px';
    notesTextarea.value = record.notes || ''; // Set the initial value of the text area to the record's notes
    notesTextarea.addEventListener('input', function () {
        record.notes = notesTextarea.value; // Update the record's notes property on input
        updateData(record); // Update the data to reflect changes
    });

    notesContainer.appendChild(notesTextarea);
    detailsPanel.appendChild(notesContainer);

    // Add a button to delete the record below the notes section
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete this record';
    deleteButton.classList.add("btn");
    deleteButton.addEventListener('click', function () {
        deleteRecord(record); // Function to delete the record
    });
    detailsPanel.appendChild(deleteButton);
}

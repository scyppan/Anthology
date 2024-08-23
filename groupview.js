document.getElementById('group-search').addEventListener('input', function() {
    document.getElementById('toggle-linked').checked = false;
    let query = this.value.trim();
    if (query === '') {
        displayAllGroups(); // Display all groups if query is empty
    } else {
        filterGroups(query); // Filter groups based on query
    }
});

function showAutocomplete(groups) {
    let autocompleteList = document.getElementById('autocomplete-list');
    autocompleteList.innerHTML = '';

    // Flatten and map groups to just the group names
    const groupNames = [...new Set(groups.map(groupObj => groupObj.group))]; 

    groupNames.forEach(group => {
        if (group && group.trim() !== '') { // Check for existence and non-empty strings
            let item = document.createElement('div');
            item.textContent = group;
            item.addEventListener('click', function() {
                addGroupToView(group);
                document.getElementById('add-all-groups-btn').classList.remove('hidden');
                autocompleteList.innerHTML = ''; // Hide the list after selection
            });
            autocompleteList.appendChild(item);
        }
    });
}

function showAllGroups() {
    let allGroups = data.map(record => record.groups).flat().filter(group => group); // Filter out undefined or null groups
    showAutocomplete([...new Set(allGroups)]);
}

function addGroupToView(groupName) {
    let groupContent = document.getElementById('group-content');
    
    // Check if the group is already displayed
    if (document.getElementById(`group-${groupName}`)) {
        return;
    }
    
    let groupDiv = document.createElement('div');
    groupDiv.id = `group-${groupName}`;
    groupDiv.className = 'group-item';
    groupDiv.innerHTML = `<h2>${groupName}</h2><div class="group-members"></div>`;
    
    let groupMembers = data.filter(record => record.groups && record.groups.some(groupObj => groupObj.group === groupName));
    
    // Sort the group members by priority (empty priorities go to the bottom)
    groupMembers.sort((a, b) => {
        const aPriority = a.groups.find(groupObj => groupObj.group === groupName).priority || Infinity;
        const bPriority = b.groups.find(groupObj => groupObj.group === groupName).priority || Infinity;
        return aPriority - bPriority;
    });
    
    groupMembers.forEach(member => {
        let groupObj = member.groups.find(groupObj => groupObj.group === groupName);
        let memberItem = document.createElement('div');
        memberItem.className = 'data-record'; // Add the data-record class
        
        // Conditionally include the role if it's not empty
        const roleText = groupObj.role ? ` (${groupObj.role})` : '';
        memberItem.textContent = `${member.id}${roleText}`; // Display member name with role (if available)
        
        memberItem.addEventListener('click', function() {
            populateDetailsPanel(member);
        });
        groupDiv.querySelector('.group-members').appendChild(memberItem);
    });
    
    groupContent.appendChild(groupDiv);
}

function addAllGroups(groups) {
    let groupNames = [...new Set(groups.map(record => record.groups).flat())];
    groupNames.forEach(groupName => addGroupToView(groupName));
}

function displayAllGroups() {
    const groupContent = document.getElementById('group-content');
    groupContent.innerHTML = ''; // Clear existing content

    const allGroups = new Set(data.flatMap(record => record.groups || []).map(groupObj => groupObj.group));
    allGroups.forEach(groupName => {
        if (groupName && groupName.trim() !== '') {
            let groupDiv = document.createElement('div');
            groupDiv.id = `group-${groupName}`;
            groupDiv.className = 'group-item';
            groupDiv.innerHTML = `<h4>${groupName}</h4><div class="group-members"></div>`;

            let groupMembers = data.filter(record => record.groups && record.groups.some(groupObj => groupObj.group === groupName));

            // Sort the group members by priority (empty priorities go to the bottom)
            groupMembers.sort((a, b) => {
                const aPriority = a.groups.find(groupObj => groupObj.group === groupName).priority || Infinity;
                const bPriority = b.groups.find(groupObj => groupObj.group === groupName).priority || Infinity;
                return aPriority - bPriority;
            });

            groupMembers.forEach(member => {
                let groupObj = member.groups.find(groupObj => groupObj.group === groupName);
                let memberItem = document.createElement('div');
                memberItem.className = 'data-record';
                
                // Conditionally include the role if it's not empty
                const roleText = groupObj.role ? ` (${groupObj.role})` : '';
                memberItem.textContent = `${member.id}${roleText}`; // Display member name with role (if available)
                
                memberItem.addEventListener('click', function() {
                    populateDetailsPanel(member);
                });
                groupDiv.querySelector('.group-members').appendChild(memberItem);
            });

            groupContent.appendChild(groupDiv);
        }
    });
}

function displayLinkedGroups(record) {
    // Find characters linked from the selected character
    const linkedFromRecords = record.links.map(link => data.find(item => item.id === link.target)).filter(item => item);

    // Find characters linking to the selected character
    const linkedToRecords = data.filter(item => item.links.some(link => link.target === record.id));

    // Combine and remove duplicates
    const linkedRecords = [...new Set([...linkedFromRecords, ...linkedToRecords])];

    // Find groups the linked records belong to
    const linkedGroups = new Set();
    linkedRecords.forEach(item => {
        item.groups.forEach(group => linkedGroups.add(group));
    });

    console.log('Linked groups:', Array.from(linkedGroups));  // Log linked groups for debugging

    // Display the linked groups
    loadGroups(Array.from(linkedGroups));
}

function filterGroups(query) {
    const groupContent = document.getElementById('group-content');
    groupContent.innerHTML = ''; // Clear existing content

    // Flatten groups into an array of group names
    const filteredGroups = [...new Set(data.flatMap(record => record.groups || [])
        .map(groupObj => groupObj.group)
        .filter(groupName => groupName.toLowerCase().includes(query.toLowerCase())))]; // Filter groups by query

    filteredGroups.forEach(groupName => {
        if (groupName && groupName.trim() !== '') { // Check for existence and non-empty strings
            let groupDiv = document.createElement('div');
            groupDiv.id = `group-${groupName}`;
            groupDiv.className = 'group-item';
            groupDiv.innerHTML = `<h4>${groupName}</h4><div class="group-members"></div>`;

            let groupMembers = data.filter(record => record.groups && record.groups.some(groupObj => groupObj.group === groupName));
            groupMembers.forEach(member => {
                let memberItem = document.createElement('div');
                memberItem.className = 'data-record'; // Add the data-record class
                memberItem.textContent = member.id;
                memberItem.addEventListener('click', function() {
                    populateDetailsPanel(member);
                });
                groupDiv.querySelector('.group-members').appendChild(memberItem);
            });

            groupContent.appendChild(groupDiv);
        }
    });
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

function updateGroupView(record) {
    const linkedRecords = getLinkedRecords(record);
    const linkedGroups = getLinkedGroups(linkedRecords);

    const groupContent = document.getElementById('group-content');
    groupContent.innerHTML = ''; // Clear existing content

    linkedGroups.forEach(groupName => {
        if (groupName && groupName.trim() !== '') {
            let groupDiv = document.createElement('div');
            groupDiv.id = `group-${groupName}`;
            groupDiv.className = 'group-item';
            groupDiv.innerHTML = `<h4>${groupName}</h4><div class="group-members"></div>`;

            let groupMembers = linkedRecords.filter(record => record.groups && record.groups.includes(groupName));
            groupMembers.forEach(member => {
                let memberItem = document.createElement('div');
                memberItem.className = 'data-record';
                memberItem.textContent = member.id;
                memberItem.addEventListener('click', function() {
                    populateDetailsPanel(member);
                });
                groupDiv.querySelector('.group-members').appendChild(memberItem);
            });

            groupContent.appendChild(groupDiv);
        }
    });
}
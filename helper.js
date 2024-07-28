function generateUniqueId(baseId) {
    let uniqueId = baseId;
    let counter = 1;

    while (data.some(record => record.id === uniqueId)) {
        uniqueId = `${baseId} ${counter}`;
        counter++;
    }

    return uniqueId;
}


function insertCommonKeys(newRecord) {
    const keyCount = {};
    const threshold = Math.ceil(data.length / 2);

    // Count occurrences of each key
    data.forEach(record => {
        Object.keys(record).forEach(key => {
            if (key !== 'id') {
                keyCount[key] = (keyCount[key] || 0) + 1;
            }
        });
    });

    // Add keys that appear in over half of the records
    Object.keys(keyCount).forEach(key => {
        if (keyCount[key] >= threshold) {
            if (!(key in newRecord)) {
                newRecord[key] = ''; // Initialize with an empty value
            }
        }
    });
}

function addUniqueIdSuffixes(array) {
    const idCount = new Map();
    
    for (let record of array) {
        const baseId = record.id;
        console.log(`Checking id: ${baseId}`);
        if (idCount.has(baseId)) {
            // Increment the counter for this baseId
            const count = idCount.get(baseId) + 1;
            idCount.set(baseId, count);
            // Append the counter to the baseId to make it unique
            record.id = `${baseId} ${count}`;
            console.log(`Duplicate found: ${baseId}, new id: ${record.id}`);
        } else {
            // Initialize the counter for this baseId
            idCount.set(baseId, 1);
            console.log(`First occurrence: ${baseId}`);
        }
    }
}
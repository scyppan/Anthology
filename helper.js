function generateUniqueId(baseId) {
    let uniqueId = baseId;
    let counter = 1;

    
    try{
        console.log("somedata" , data.some((record => record.id === uniqueId)));

        
        while (data.some(record => record.id === uniqueId)) {
            uniqueId = `${baseId} ${counter}`;
            counter++;
        }
    }catch{}

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

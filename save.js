function saveDataToLocalStorage() {
    const serializedData = JSON.stringify(data);
    localStorage.setItem('graphData', serializedData);
    console.log('Data saved to localStorage');
}

// Function to load data from localStorage
function loadDataFromLocalStorage() {
    const serializedData = localStorage.getItem('graphData');
    if (serializedData) {
        data = JSON.parse(serializedData);
        console.log('Data loaded from localStorage', data);
        loadgraph(data);
    } else {
        console.log('No saved data found in localStorage');
    }
}

window.addEventListener('beforeunload', function() {
    saveDataToLocalStorage();
});

window.addEventListener('load', function() {
    loadDataFromLocalStorage();
});

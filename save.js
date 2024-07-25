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


function exportDataAsJSON() {
    const dataStr = JSON.stringify(data, null, 2); // Convert data to JSON string with pretty print
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const datetimeString = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "familytree-"+datetimeString+".json"; // Default filename for the exported data
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
}

// Ensure the export function is available globally
window.exportDataAsJSON = exportDataAsJSON;
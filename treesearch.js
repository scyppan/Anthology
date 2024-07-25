document.getElementById('tree-search').addEventListener('input', function() {
    document.getElementById('toggle-linked').checked = false;
    let query = document.getElementById('tree-search').value.trim();
    searchTree(query);
});

function searchTree(query) {
    if (query === '') {
        loadgraph(data); // Load the full graph if the query is empty
        return;
    }

    query = query.toLowerCase();
    const matchedNodes = data.filter(node => node.id && node.id.toLowerCase().includes(query));

    const result = new Set();
    matchedNodes.forEach(node => {
        traverseNodes(node, result);
    });

    const searchResults = Array.from(result); // Convert set back to array for further use
    
    loadgraph(searchResults); // Use the existing loadgraph function
}

function traverseNodes(node, result) {
    if (!result.has(node)) {
        result.add(node);

        // Recursively add all nodes linked via links from this node
        node.links.forEach(link => {
            const targetNode = data.find(n => n.id === link.target);
            if (targetNode) {
                traverseNodes(targetNode, result);
            }
            const sourceNode = data.find(n => n.id === link.source);
            if (sourceNode) {
                traverseNodes(sourceNode, result);
            }
        });

        // Recursively add all nodes that link to this node
        data.forEach(relatedNode => {
            if (relatedNode.links.some(link => link.target === node.id || link.source === node.id)) {
                traverseNodes(relatedNode, result);
            }
        });
    }
}
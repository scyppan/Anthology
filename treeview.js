let svg;
let graphData = null;

// Converts data to nodes and links
function convertDataToNodes(data) {
    let nodes = [];
    let links = [];

    // Create nodes
    data.forEach(item => {
        nodes.push({ id: item.id, fx: item.fx, fy: item.fy });
    });

    // Create links from the 'links' array within each item
    data.forEach(item => {
        item.links.forEach(link => {
            const sourceNode = nodes.find(node => node.id === item.id);
            const targetNode = nodes.find(node => node.id === link.target);

            if (sourceNode && targetNode) {
                links.push({
                    source: item.id,
                    target: link.target,
                    type: link.type
                });
            }
        });
    });

    return { nodes, links };
}

// Loads and draws the graph
function loadgraph(data) {
    graphData = convertDataToNodes(data);
    const width = document.getElementById('graph-container').offsetWidth;
    const height = document.getElementById('graph-container').offsetHeight;

    svg = d3.select("#graph")
        .attr("width", width)
        .attr("height", height);

    // Clear the SVG of all nodes before loading new data
    svg.selectAll("*").remove();

    // Check and adjust node positions
    checkAndAdjustNodePositions(graphData.nodes, data, width, height);

    // Draw links
    drawLinks(svg, graphData, findNodeById);

    // Draw nodes
    svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graphData.nodes)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", d => d.fx)
        .attr("cy", d => d.fy)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("click", function(event, d) {
            if (!event.defaultPrevented) { // Prevent click from firing during drag
                populateDetailsPanel(data.find(item => item.id === d.id));
            }
        });

        svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graphData.nodes)
        .enter().append("text")
        .attr("dy", -10) // Adjusted dy value for closer label
        .attr("text-anchor", "middle")
        .attr("x", d => d.fx)
        .attr("y", d => d.fy)
        .text(d => d.id)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("click", function(event, d) {
            if (!event.defaultPrevented) { // Prevent click from firing during drag
                populateDetailsPanel(data.find(item => item.id === d.id));
            }
        });

    function checkAndAdjustNodePositions(nodes, data, width, height) {
        nodes.forEach(node => {
            const originalNode = data.find(item => item.id === node.id);
            if (node.fx !== undefined && node.fx > width) {
                node.fx = width - 10;
                if (originalNode) originalNode.fx = node.fx;
            }
            if (node.fy !== undefined && node.fy > height) {
                node.fy = height - 10;
                if (originalNode) originalNode.fy = node.fy;
            }
        });
    }

    function dragstarted(event, d) {
        if (!event.active) 
        d.fx = d.x;
        d.fy = d.y;
    } 
    
    function dragended(event, d) {
        // Update the original dataset with new positions
        const originalNode = data.find(item => item.id === d.id);
        if (originalNode) {
            originalNode.fx = d.fx;
            originalNode.fy = d.fy;
        }
        d3.select(this).classed("active", false);
    
        // Redraw links to ensure they are correctly positioned after drag ends
        drawLinks(svg, graphData, findNodeById);
    }
}

// Draws a single link
function drawLink(sourceId, targetId, type) {
    const sourceNode = findNodeById(sourceId);
    const targetNode = findNodeById(targetId);

    if (!sourceNode || !targetNode) return;

    // Add the new link to graphData.links
    graphData.links.push({ source: sourceId, target: targetId, type: type });

    // Re-bind the data to include the new link
    const link = svg.selectAll(".links line")
        .data(graphData.links)
        .enter().append("line")
        .attr("class", d => `link ${d.type}`)
        .attr("stroke-width", 2)
        .attr("x1", d => findNodeById(d.source).fx)
        .attr("y1", d => findNodeById(d.source).fy)
        .attr("x2", d => findNodeById(d.target).fx)
        .attr("y2", d => findNodeById(d.target).fy);
}

// Draws all links
function drawLinks(svg, graphData, findNodeById) {
    svg.selectAll(".links").remove();

    return svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graphData.links)
        .enter().append("line")
        .attr("class", d => `link ${d.type}`)
        .attr("stroke-width", 2)
        .attr("x1", d => findNodeById(d.source).fx)
        .attr("y1", d => findNodeById(d.source).fy)
        .attr("x2", d => findNodeById(d.target).fx)
        .attr("y2", d => findNodeById(d.target).fy);
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
    d3.select(this).attr("cx", d.fx).attr("cy", d.fy);
    d3.select(this).select("text").attr("x", d.fx).attr("y", d.fy);

    // Update node and link positions
    updateNodeAndLinkPositions(d);
}

// Updates node and link positions
function updateNodeAndLinkPositions(d) {
    // Update node position in graphData
    const nodeInGraphData = findNodeById(d.id);
    if (nodeInGraphData) {
        nodeInGraphData.fx = d.fx;
        nodeInGraphData.fy = d.fy;
    }

    // Update node position in original data
    let nodeInData = data.find(item => item.id === d.id);
    if (nodeInData) {
        nodeInData.fx = d.fx;
        nodeInData.fy = d.fy;
    }

    // Update visual representation of the node
    svg.selectAll(".nodes circle")
        .filter(node => node.id === d.id)
        .attr("cx", d.fx)
        .attr("cy", d.fy);

    svg.selectAll(".labels text")
        .filter(label => label.id === d.id)
        .attr("x", d.fx)
        .attr("y", d.fy - 5);  // Adjusted dy value for closer label

    // Update link positions
    svg.selectAll(".links line")
        .filter(link => link.source === d.id || link.target === d.id)
        .each(function(link) {
            const sourceNode = findNodeById(link.source);
            const targetNode = findNodeById(link.target);

            if (sourceNode && targetNode) {
                d3.select(this)
                    .attr("x1", sourceNode.fx)
                    .attr("y1", sourceNode.fy)
                    .attr("x2", targetNode.fx)
                    .attr("y2", targetNode.fy);
            }
        });
}

function findNodeById(id) {
    return graphData.nodes.find(node => node.id === id);
}
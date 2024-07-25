let linkMode = false;
let linkSource = null;

function startLinkMode(linkIndex) {
    console.log('Link mode started for link index:', linkIndex); // Log link mode start
    linkMode = true;
    linkSource = {
        recordId: document.getElementById('nodeName').dataset.nodeId,
        linkIndex: linkIndex
    };
    document.body.style.cursor = 'pointer'; // Change cursor to pointer
    const linkModeIndicator = document.getElementById('link-mode-indicator') || document.createElement('div');
    linkModeIndicator.id = 'link-mode-indicator';
    linkModeIndicator.textContent = 'Link Mode Active: Click a record to link';
    linkModeIndicator.style.position = 'fixed';
    linkModeIndicator.style.top = '10px';
    linkModeIndicator.style.left = '50%';
    linkModeIndicator.style.transform = 'translateX(-50%)';
    linkModeIndicator.style.padding = '10px';
    linkModeIndicator.style.border = '1px solid black';
    if (!document.getElementById('link-mode-indicator')) {
        document.body.appendChild(linkModeIndicator);
    }
}

// Function to show the modal with the given message
function showModal(message) {
    const modal = document.getElementById('link-error-modal');
    const modalMessage = document.getElementById('link-error-message');
    const closeBtn = document.getElementsByClassName('close')[0];

    modalMessage.textContent = message;
    modal.style.display = 'block';

    // Close the modal when the user clicks on <span> (x)
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

document.addEventListener('click', function(event) {
    if (!linkMode) return;

    const target = event.target.closest('.data-record, .labels text, .nodes circle');
    if (target) {
        const targetRecordId = target.textContent ? target.textContent.trim() : target.__data__.id;
        console.log('Target record ID:', targetRecordId); // Log the target record ID

        const sourceRecord = data.find(rec => rec.id === linkSource.recordId);
        if (sourceRecord) {
            if (isUniqueLink(targetRecordId, sourceRecord.links)) {
                sourceRecord.links[linkSource.linkIndex].target = targetRecordId;
                updateData(sourceRecord);

                // Ensure that graphData is updated to reflect changes
                graphData = convertDataToNodes(data); // Update graphData to include new links

                // Redraw links to include the new one
                const svg = d3.select("#graph");
                drawLinks(svg, graphData, findNodeById);

                // Optionally, redraw nodes and labels if they might have changed
                // drawNodes(svg, graphData, findNodeById);
                // drawLabels(svg, graphData, findNodeById);
            } else {
                showModal('The selected ID is already linked. Please choose a different ID. Link mode will close now.');
            }
            linkMode = false;
            linkSource = null;
            document.body.style.cursor = 'default';
            const linkModeIndicator = document.getElementById('link-mode-indicator');
            if (linkModeIndicator) {
                document.body.removeChild(linkModeIndicator);
            }
            populateDetailsPanel(sourceRecord);
        } else {
            console.error('Source record not found');
        }
    }
});

function isUniqueLink(targetId, links) {
    return !links.some(link => link.target === targetId);
}



// main.js
function changewindow(which) {
    let datasec = document.getElementById("dataview");
    let listsec = document.getElementById("listview");
    let treesec = document.getElementById("treeview");
    let groupsec = document.getElementById("groupview");

    if (datasec) datasec.classList.add("hidden");
    if (listsec) listsec.classList.add("hidden");
    if (treesec) treesec.classList.add("hidden");
    if (groupsec) groupsec.classList.add("hidden");

    switch(which) {
        case "datasec":
            if (datasec && datasec.classList.contains('hidden')) {
                datasec.classList.remove('hidden');
            }
            break;
        case "listsec":
            if (listsec && listsec.classList.contains('hidden')) {
                listsec.classList.remove('hidden');
                createtablefromdata();
            }
            break;
        case "treesec":
            if (treesec && treesec.classList.contains('hidden')) {
                treesec.classList.remove('hidden');
                loadgraph(data);
            }
            break;
        case "groupsec":
            if (groupsec && groupsec.classList.contains('hidden')) {
                groupsec.classList.remove('hidden');
                displayAllGroups();
            }
            break;
    }
}


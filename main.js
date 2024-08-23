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

                const inputElement = document.getElementById('nodeName');

                let nodeid;
                try{
                    nodeid= inputElement.getAttribute('data-node-id');
                } catch{

                }
                
                let record = data.find(x=> x.id==nodeid);
                if(toggleLinkedCheckbox && record){
                    updateGroupView(record);
                }else{
                    displayAllGroups();
                }
            }
            break;
    }
}

function openDonateLink() {
    const amount = 25; // Set your default amount here
    const paypalLink = `https://www.paypal.com/donate/?business=DQVHYD3L44F94&no_recurring=0&item_name=I+make+these+tools+to+support+artists%2C+not+to+make+money.+But%2C+donations+help+me+afford+to+spend+time+supporting+these+tools.+&currency_code=USD&amount=25`;
    window.open(paypalLink, '_blank'); // Opens the link in a new tab
}
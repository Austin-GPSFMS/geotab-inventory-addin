(function() {
    let api, state;

    window.geotab.addin.inventoryManager = function(apiRef, stateRef) {
        api = apiRef;
        state = stateRef;

        return {
            initialize: function(api, state, addinConfig) {
                document.getElementById('inventory-content').innerHTML = "<h2>Inventory Manager</h2>";
                this.loadInventory();
            },
            focus: function() {
                this.loadInventory();
            },
            loadInventory: function() {
                api.call("Get", { typeName: "UserData", search: { key: "InventoryData" } }, function(result) {
                    let inventory = result.length ? JSON.parse(result[0].value) : [];
                    let table = "<table border='1'><tr><th>Part Name</th><th>Quantity</th></tr>";
                    inventory.forEach(item => {
                        table += `<tr><td>${item.name}</td><td>${item.quantity}</td></tr>`;
                    });
                    table += "</table>";
                    document.getElementById('inventory-content').innerHTML += table;
                }, function(error) {
                    console.error("Error fetching inventory:", error);
                });
            },
            updateInventory: function(name, quantity) {
                api.call("Get", { typeName: "UserData", search: { key: "InventoryData" } }, function(result) {
                    let inventory = result.length ? JSON.parse(result[0].value) : [];
                    let item = inventory.find(i => i.name === name);
                    
                    if (item) {
                        item.quantity = quantity;
                    } else {
                        inventory.push({ name, quantity });
                    }
                    
                    api.call("Add", { typeName: "UserData", entity: { key: "InventoryData", value: JSON.stringify(inventory) } }, function() {
                        console.log("Inventory updated successfully!");
                    }, function(error) {
                        console.error("Error updating inventory:", error);
                    });
                });
            }
        };
    };
})();

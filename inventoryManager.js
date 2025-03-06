(function() {
    let api, state;

    window.geotab.addin.inventoryManager = function(apiRef, stateRef) {
        console.log("Initializing Inventory Manager Add-In...");
        console.log("API Reference:", apiRef);
        console.log("State Reference:", stateRef);

        api = apiRef;
        state = stateRef;

        return {
            initialize: function(api, state, addinConfig) {
                console.log("Add-In Initialized with:", addinConfig);
                document.getElementById('inventory-content').innerHTML = "<h2>Inventory Manager</h2>";
                this.loadInventory();
            },
            focus: function() {
                console.log("Inventory Manager in focus");
                this.loadInventory();
            },
            loadInventory: function() {
                console.log("Loading Inventory...");
                api.call("Get", { typeName: "UserData", search: { key: "InventoryData" } }, function(result) {
                    console.log("Inventory Data Retrieved:", result);
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
            }
        };
    };
})();

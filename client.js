const axios = require('axios');

const LOCAL_STORAGE = []; // here we are simulating a local DB

// simulate storing data locally
const storeLocally = (data) => { LOCAL_STORAGE.push(data); console.log('Stored Data Locally:', data); };

// simulate syncing data to server
const syncData = async () => {
    if(LOCAL_STORAGE.length > 0){
        const dataToSync = LOCAL_STORAGE.splice(0, LOCAL_STORAGE.length); // clearing local-stoage

        try{
            const response = await axios.post('http://localhost:5000/sync', { data: dataToSync });
            console.log('Pending action...', response.data);
        }catch(error){
            console.log('There was an error syncing data to server', error);
        }
    }else{
        console.log("No Data Available to Sync");
    }
}

const simulateUserOfflineActivity = () => {
    console.log('simulating user offline activity...');
    setTimeout(() =>{
        storeLocally({ id: 1, content: 'Saved Admin User' })
    }, 1000);
    setTimeout(() =>{
        storeLocally({ id: 2, content: 'Edited Records' });
    }, 10000);
    setTimeout(() =>{
        storeLocally({ id: 3, content: 'Modified the table data' });
    }, 20000);
    setTimeout(() =>{
        storeLocally({ id: 4, content: 'Added a new user' });
    }, 30000);
    setTimeout(() =>{
        storeLocally({ id: 5, content: 'Deleted User' });
    }, 40000);

    console.log('App is still offline, waiting for network connection...');
}

// simulate coming online and syncing data
setTimeout(() => {
    console.log('App is back online...');
    syncData();
}, 50000);

simulateUserOfflineActivity();
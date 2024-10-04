## OFFLINE-FIRST APPROACH USING REDIS

#### HOW TO RUN THE APP

- Install the required modules (*npm install*)
- Create a .env file (*check the .env.example for data needed*)
- Run the server first (*npm run server*)
- Wait until the server is connected to REDIS CLOUD / or your own local redis connection
- Run the client (*npm run client*)


#### HOW IT WORKS

- The client simulates user interaction when the app is offline
- The activities are stored locally on the client side / Local DB
- When the app comes back online it sends all the activites / data stored locally to the server for syncing
- The server sends this data to a Queue in redis, thru an endpoint "/sync"
- The data in the redis Queue is stored and waits for processing
- Another endpoint "/process-sync" starts processing this data one-by-one in the Queue until all activites are processed(*check sync data.http file to see how to interact with this endpoint*)
- After the processing has been completed the Queue is emptied and deleted, giving space to other incoming data

**Note: In this demo you can choose what local storage you want to use,
        I recommended using Indexed LocalDB, Same for the sync processing**.


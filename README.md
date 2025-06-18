# clone repository 
git clone https://github.com/Sujeet-sharma786/FullStack-Assingment.git
cd FullStack-Assingment
# setup backend
Create a .env file in the backend folder with your PostgreSQL connection string:
``` 
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<db_name>"

```
Then run :

```
cd backend
npm install
npm run build
npm start
```

# setup frontend
```
cd ../frontend
npm install
npx expo start
```

Also update the endpoint for your local network:
Use your computer’s local IP address (replace 192.168.110.75 with your actual IP) in graphql.ts and socket.ts.

```
// frontend/api/graphql.ts
const ENDPOINT = 'http://<your-local-ip>:4000/graphql';

// frontend/api/socket.ts
const ENDPOINT = 'http://<your-local-ip>:4000';
```
Use the Expo Go Android app to scan the QR code and see the app on your device.
Or
simply press w in terminal running frontend to  see the app.

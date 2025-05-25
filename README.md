# getHealth
An international field project Collaboration with MIVA x AAMU x MIT ADT University on uPivotal Platform

## Project Setup Guide
### Install Dependencies

**Install root dependencies:**
```bash
npm install
```

**Install client dependencies:**
```bash
cd client
npm install
```

**Install server dependencies:**
```bash
cd ../server
npm install
```

## Scripts & Commands
Run from the *root directory* 

Starts the React frontend   
```bash
npm run client
```

Starts the Express backend       
```bash
npm run server
```

-Starts both frontend and backend concurrently (if configured) 
```bash
npm run dev
```

> Make sure `concurrently` is installed if using `npm run dev`.

## Using `axios.js` for API Calls

Use the pre-configured Axios instance in `/src/lib/axios.js` for all API requests.

### Key Features
- Sends cookies with requests (`withCredentials`)
- Auto-refreshes access token on `401 Unauthorized` errors
- Retries failed requests after token refresh

### How to Use

```js
import api from '../lib/axios';

const res = await api.get('/user/profile');
```

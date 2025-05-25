# getHealth
An international field project Collaboration with MIVA x AAMU x MIT ADT University on uPivotal Platform

# Scripts & Commands

Run from the *root directory* 

`npm run client` Starts the React frontend                                     
`npm run server` Starts the Express backend                                    
`npm run dev`    Starts both frontend and backend concurrently (if configured) 

> Make sure `concurrently` is installed if using `npm run dev`.


## Using `axios.js` for API Calls

Use the pre-configured Axios instance in `/src/lib/axios.js` for all API requests.

### Key Features
- Sends cookies with requests (`withCredentials`)
- Auto-refreshes access token on `401 Unauthorized` errors
- Retries failed requests after token refresh

### How to Use

```js
import api from '../utils/axios';

const res = await api.get('/user/profile');

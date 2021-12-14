# bandwidth-server

Tool to test the bandwidth capabilities of a network. Server/orchestration component.

## How do I run it?

```
nvm use 16
npm ci
npm run build
```

Create a `.env` file with a MongoDB URI:

```
MONGO_URI=mongodb://localhost:27017/myDatabase
```

and run the server:

```
 npm run backend
```

Now [install the client side](https://github.com/techied/bandwidth-client)!
import express from 'express';

const app = express();

// Serve static files from the React app
app.use(express.static('./build'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(3001, () => {
    console.log('Listening on http://localhost:3001');
});
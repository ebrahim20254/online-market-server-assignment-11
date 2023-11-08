const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleWere
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('job server is running')
})

app.listen(port, () => {
    console.log(`online job server is running on port ${port}`);
})
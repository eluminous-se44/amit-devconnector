const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//DB config
const db= require('./config/keys').mongoURI;

//connect to monodb
mongoose.
    connect(db, { useUnifiedTopology: true,useNewUrlParser: true })
    .then(()=>console.log('MongoDB connected'))
    .catch(err=>console.log(err));
    
app.get('/',(req,res)=>res.send('Hello World'));

const port= process.env.PORT || 5000;

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port,()=>console.log(`Server running on port ${port}`));
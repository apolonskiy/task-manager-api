const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify: false
    }).catch(error => console.log(error));

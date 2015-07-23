var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost:27017/myappdatabase'),  
   
    userSchema = new mongoose.Schema({
        urlList: Array,
        frontPage: String,  
        pdfLocation: String,  
        email: { type: String, lowercase: true }, 
        preparedBy: String,   
        preparedFor: String
    }),
    user = mongoose.model('user', userSchema);

module.exports = {
    user: user
}
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const testSchema = new schema({
    name: String
});

module.exports = mongoose.model('Test', testSchema);

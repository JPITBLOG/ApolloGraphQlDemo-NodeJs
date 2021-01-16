'use strict';
const express = require('express');

const mongoose = require('mongoose');
const Tasks = require('./model/Test');
const students = require('./model/studentModel');
const marksModel = require('./model/marksModel');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema/schema');
const schema = require('./schema/schema');

const startServer = async () => {
    const app = express();

    await mongoose.connect("mongodb://localhost/Tododb", {useNewUrlParser: true, useUnifiedTopology: true});

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    server.applyMiddleware({ app });

    //mongoose instance connection url

    app.listen({ port: 4000 }, () =>
        console.log(`🚀  Server ready at port 4000`)
    );

}

startServer();

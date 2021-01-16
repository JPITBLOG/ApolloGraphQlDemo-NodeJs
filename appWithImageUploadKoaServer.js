'use strict';
const staticServer = require('koa-static');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mkdirp = require('mkdirp');
const { ApolloServer } = require('apollo-server-koa');
const { graphqlUploadKoa } = require('graphql-upload');
const Koa = require('koa');

const mongoose = require('mongoose');
const Tasks = require('./model/Test');
const students = require('./model/studentModel');
const marksModel = require('./model/marksModel');
const { typeDefs, resolvers } = require('./schema/schema');
const schema = require('./schema/schema');
const UPLOAD_DIR = `./images`;

const startServer = async () => {

    //ensure upload dir
    mkdirp.sync(UPLOAD_DIR);

    let dir = path.join(__dirname, 'public');

    const app = new Koa().use(
        graphqlUploadKoa({
            maxFileSize: 10000000,
            maxFiles: 20
        })
    );

    app.use(staticServer(path.join(__dirname, 'public')));

    await mongoose.connect("mongodb://localhost/Tododb", {useNewUrlParser: true, useUnifiedTopology: true});

    const server = new ApolloServer({
        uploads: false,
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

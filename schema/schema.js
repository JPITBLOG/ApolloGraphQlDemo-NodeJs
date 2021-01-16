'use strict';
const { gql, GraphQLUpload } = require('apollo-server-express');
const { createWriteStream } = require('fs');
const shortId = require('shortid');
const multer = require('multer');

const mongoose = require('mongoose');
const students = mongoose.model('Students');

const { listAllStudentQuery, createStudentQuery, updateStudentQuery, deleteStudentQuery } = require('../controller/student');

const storeUpload = async ({ stream, filename, mimetype }) => {
    const id = shortId.generate();
    const path = `images/${id}-${filename}`;

    const writeStream = createWriteStream(path);

    return new Promise((resolve, reject) =>
        stream
            .pipe(writeStream)
            .on("finish", () => resolve(path, filename, mimetype))
            .on("error", reject)
    );
};

const processUpload = async (upload) => {
    const { createReadStream, filename, mimetype } = await upload.promise;
    const stream = createReadStream();
    const file = storeUpload({ stream, filename, mimetype });
    return file;
};

const TestSchema = mongoose.model(`Test`);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

const loginUserQuery = (userName) => {
    if (userName == 'test') {
        return {
            userName: 'test',
            email: 'test@gmail.com'
        }
    }
}

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

const resolvers = {
    Query: {
        books: () => books,
        listAllStudents: async () => listAllStudentQuery()
    },
    Mutation: {
        login: (root, args) => loginUserQuery(args.userName),
        createTest: async (_,{ name}) => {
            const newTest = new TestSchema({name});
            await newTest.save();
            return newTest;
        },
        createStudent: (_,{fName, lName, dob, image, address1, address2, city, state, pinCode}) => createStudentQuery(fName, lName, dob, image, address1, address2, city, state, pinCode),
        updateStudent: async (_,{_id, fName, lName, dob, address1, address2, city, state, pinCode}) => updateStudentQuery(_id, fName, lName, dob, address1, address2, city, state, pinCode),
        deleteStudent: async (_,{_id}) => deleteStudentQuery(_id),
        imageUpload: async (_, {imgFile} ) => {
            const upload = processUpload(imgFile);
            console.log('upload process: ', upload);
            return upload;
        }
    }
};

const typeDefs = gql`
  
  scalar Upload
  
  type Resp {
    getTrue: Boolean
  }
  
  type Book {
    title: String
    author: String
  }
    
  type loginData {
      userName: String,
      email: String
  }
  
  type studentList {
    isDelete: Int
    _id: ID
    imgUrl: String
    fName: String
    lName: String
    dob: String
    address1: String
    address2: String
    city: String
    state: String
    pinCode: Int
  }
  
  type Test {
        id: ID
        name: String
  }
  
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  
  input studentInput {
    title: String
    body: String
  }
  
  type createdStudent {
    isDelete: Int,
    fName: String,
    lName: String,
    dob: String, 
    address1: String, 
    address2: String, 
    city:  String, 
    state: String, 
    pinCode: Int
  }
  
  type updatedStudent {
    _id: ID
    isDelete: Int,
    fName: String,
    lName: String,
    dob: String, 
    address1: String, 
    address2: String, 
    city:  String, 
    state: String, 
    pinCode: Int
  }
  
  type deletedStudentMsg {
    isDeleted: Int
  }
  
  type Query {
    books: [Book]
    listAllStudents: [studentList]
  }
    
  type Mutation {
    login(userName: String!): loginData
    createTest(name: String!): Test
    createStudent(fName: String!, lName: String!, dob: String!, image: Upload!, address1: String!, address2: String!, city: String!, state: String!, pinCode: String!): createdStudent
    updateStudent(_id: String!, fName: String!, lName: String!, dob: String!, address1: String!, address2: String!, city: String!, state: String!, pinCode: String!): updatedStudent
    deleteStudent(_id: String!): deletedStudentMsg
    imageUpload(imgFile: Upload!): File!
  }
  `;

module.exports = {
    resolvers,
    typeDefs
}
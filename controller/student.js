'use strict';

const async = require('async');
const { createWriteStream } = require('fs');
const shortId = require('shortid');
const mongoose = require('mongoose');
const students = mongoose.model('Students');
const studentMarks = mongoose.model('studentMarks');

const storeUpload = async ({ stream, filename, mimetype }) => {
    const id = shortId.generate();
    const path = `images/${id}-${filename.split(` `).join('-')}`;

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

const listAllStudentQuery = async () =>
    await students.find({}, async (err, students) => {
        if (err)
            return (err);
        await mapStudentMarks(students, (studentWithMarks) => {
            return (students);
        });
    });

const createStudentQuery = (fName, lName, dobInStr, image, address1, address2, city, state, pinCode) => {
    processUpload(image).then((uploadResponse) => {
        console.log('image upload resp: ', uploadResponse, 'path: ', `http://localhost:4000/${uploadResponse}`);
    });

    const imgUrl = null;
    let dob = new Date(dobInStr);
    let studentDataObj = {imgUrl, fName, lName, dob, address1, address2, city, state, pinCode};
    let new_student = new students(studentDataObj);
    return new Promise(( resolve, reject) => {
        new_student.save((err, createdStudent) => {
            if (err)
                reject(err)
            else resolve(createdStudent);
        })
    });
}

const updateStudentQuery = (_id, fName, lName, dob, address1, address2, city, state, pinCode) => {
    const imgUrl = null;
    dob = new Date(dob);
    let studentDataObj = { imgUrl, fName, lName, dob, address1, address2, city, state, pinCode };

    return new Promise((resolve, reject) => {
        students.findOne({_id: _id},(err, studentDetail) => {
            if (err) {
                reject(err);
            }
            else {
                studentDetail.fName = fName;
                studentDetail.lName = lName;
                studentDetail.dob = dob;
                studentDetail.address1 = address1;
                studentDetail.address2 = address2;
                studentDetail.city = city;
                studentDetail.state = state;
                studentDetail.pinCode = pinCode;

                studentDetail.save((err, updatedStudent) => {
                    if (err)
                        reject(err);
                    else resolve(updatedStudent);
                });
            }
        });
    });
}

const deleteStudentQuery = (_id) => {
    return new Promise((resolve, reject) => {
        students.deleteOne({_id: _id}, function(err, isDeleted){
            if(err) reject(err);
            else {
                console.log('is deleted: ', isDeleted);
                resolve({ isDeleted: isDeleted.deletedCount })
            }
        });
    });
}

const mapStudentMarks = (students, cb) => {
    let studentObj = {};
    let mapStudentWithMarks = [];
    async.eachSeries(students, (student, callBack) => {
        studentMarks.find({student_id: student._id}).populate('subject_id').exec((err, studentMarks) => {

            studentObj[`isDelete`] = student.isDelete;
            studentObj[`_id`] = student._id;
            studentObj[`imgUrl`] = student.imgUrl;
            studentObj[`fName`] = student.fName;
            studentObj[`lName`] = student.lName;
            studentObj[`dob`] = student.dob;
            studentObj[`address1`] = student.address1;
            studentObj[`address2`] = student.address2;
            studentObj[`city`] = student.city;
            studentObj[`state`] = student.state;
            studentObj[`pinCode`] = student.pinCode;
            studentObj[`allMarks`] = studentMarks;

            mapStudentWithMarks.push(studentObj);
            callBack();
        })

    },() => {
        cb(mapStudentWithMarks)
    });

}

module.exports = {
    listAllStudentQuery: listAllStudentQuery,
    createStudentQuery: createStudentQuery,
    updateStudentQuery: updateStudentQuery,
    deleteStudentQuery: deleteStudentQuery
}
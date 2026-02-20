require('dotenv').config();

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2", accessKeyId:process.env.AWS_ACCESS_KEY_ID, secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY});

const s3 = new AWS.S3();

const S3_Bucket = "commitsbucket";


module.exports = { s3, S3_Bucket };
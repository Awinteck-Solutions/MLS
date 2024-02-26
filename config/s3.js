require('dotenv').config()
const fs = require('fs')
const { Readable } = require('stream');
const S3 = require('aws-sdk/clients/s3')

// import { upload, getObject } from 'aws-sdk/clients/s3';
// const { Upload } = require("@aws-sdk/lib-storage");
// const { S3Client } = require("@aws-sdk/client-s3");

const bucketName = process.env.S3_BUCKET
const region = process.env.S3_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})
var timestamp = new Date().getMilliseconds() 

// uploads a file to s3
function uploadFile(file) {
    const fileStream = Readable.from(file.buffer)
  
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: `${timestamp}_${(file.originalname).split(" ").join("")}`
    }
  
    return s3.upload(uploadParams).promise()
  }
  exports.uploadFile = uploadFile
  
  
//   downloads a file from s3
  function getFileStream(fileKey) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName
    }
  
    return s3.getObject(downloadParams).createReadStream()
  }
  exports.getFileStream = getFileStream
  
const axios = require('axios');
const AWS = require('aws-sdk');
const moment = require('moment');
const s3 = new AWS.S3();
const apiTypes = require('../apiTypes.js');

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;
const FIWARE_SERVICE = process.env.FIWARE_SERVICE;
const API_KEY = process.env.API_KEY;
const S3_BUCKET = process.env.S3_BUCKET;
const API_DELAY = 5000;

async function callApiAndSaveToS3(apiType){
  const headers = {
    'fiware-service': FIWARE_SERVICE,
    'fiware-servicepath': '/' + apiType.dataname,
    'x-request-trace-id': process.env.REQUEST_TRACE_ID,
    'apikey': API_KEY
  };
  const param = new URLSearchParams({ type: apiType.entityId });
  const requestURL = `${EXTERNAL_API_URL}?${param.toString()}`;
  console.log('Calling'+ requestURL);
  try {
    const response = await axios.get(requestURL, { headers });
    const now = moment();
    const fileName = `${apiType.dataname}/${now.format('YYYY-MM-DD')}/${now.format('HH-mm-ss')}.json`;

    await s3.putObject({
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: JSON.stringify(response.data),
      ContentType: 'application/json'
    }).promise();
    console.log(`Successfully saved ${apiType.dataname} to S3.`);
    return response.data;
  } catch (error) {
    console.error(`Failed to save ${apiType.dataname} to S3.`, error);
    throw error;
  }
}

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const results = [];
  const errors = [];

  for (const apiType of apiTypes) {
    for (const apiType of apiTypes) {
      try {
        console.log(`Processing apiType: ${apiType.dataname}`);
        const result = await callApiAndSaveToS3(apiType);
        results.push({ apiType: apiType.dataname, status: 'success', data: result });
      } catch (error) {
        console.error(`Error processing ${apiType.dataname}:`, error);
        errors.push({ apiType: apiType.dataname, status: 'error', message: error.message });
      }
      // API呼び出し間に遅延を挿入
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
    }
  }

  const response = {
    statusCode: errors.length > 0 ? 500 : 200,
    body: JSON.stringify({ results, errors })
  };

  return response;
};
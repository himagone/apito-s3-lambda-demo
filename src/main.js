const axios = require('axios');
const AWS = require('aws-sdk');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const s3 = new AWS.S3();
const apiTypes = require('./apiTypes.js');
const dataFormatters = require('./dataFormatter.js');

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;
const FIWARE_SERVICE = process.env.FIWARE_SERVICE;
const API_KEY = process.env.API_KEY;
const S3_BUCKET = process.env.S3_BUCKET;

function formatData(data, dataname) {
  const formatter = dataFormatters[dataname];
  if (formatter) {
    return data.map(formatter);
  }
  return data;
}

async function callApi(apiType) {
  const requestTraceId = uuidv4();
  const headers = {
    'fiware-service': FIWARE_SERVICE,
    'fiware-servicepath': '/' + apiType.dataname,
    'x-request-trace-id': requestTraceId,
    'apikey': API_KEY
  };
  const param = new URLSearchParams({ type: apiType.entityId });
  const requestURL = `${EXTERNAL_API_URL}?${param.toString()}`;
  console.log('Calling'+ requestURL);
  try {
    const response = await axios.get(requestURL, {
      headers,
      timeout: 10000
    });
    if (response.status !== 200) {
      throw new Error(`API returned non-200 status code: ${response.status}`);
    }else if(
      !response.data ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ){
      throw new Error('API returned empty data.');
    }
    return response;
  } catch (error) {
    console.error(`Failed to get ${apiType.dataname} from api`, error);
    throw error;
  }
}

async function saveToS3(responseData, apiType){
    const now = moment();
    const fileName = `${apiType.dataname}/${now.format('YYYY-MM-DD')}/${now.format('HH-mm')}.json`;

    const formattedData = formatData(responseData, apiType.dataname);
    await s3.putObject({
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: JSON.stringify(formattedData),
      ContentType: 'application/json'
    }).promise();
    console.log(`Successfully saved ${apiType.dataname} to S3.`);
}

exports.handler = async (event) => {
  for (const apiType of apiTypes) {
    console.log(`Processing apiType: ${apiType.dataname}`);
    try {
      const response = await callApi(apiType);
      if(!response.data){
        throw new Error('API returned empty data.');
      }
      await saveToS3(response.data, apiType);
    } catch (error) {
      console.error(`Error processing ${apiType.dataname}:`, error);
      throw error;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify('Successfully processed all apiTypes.')
  };
};
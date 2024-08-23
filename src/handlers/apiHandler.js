const axios = require('axios');
const AWS = require('aws-sdk');
const moment = require('moment');
const s3 = new AWS.S3();
const apiTypes = require('../config/apiTypes.js');

async function callApiAndSaveToS3(apiType){
  const headers = {
    'fiware-service': FIWARE_SERVICE,
    'fiware-servicepath': '/' + apiType.dataname,
    'x-request-trace-id': process.env.REQUEST_TRACE_ID,
    'apikey': API_KEY
  };

  const entityId = `jp.smartcity-yaizu.${apiType.entityId}.1`;
  const param = new URLSearchParams({ type: apiType.name });
  const requestURL = `${EXTERNAL_API_BASE_URL}${entityId}?${param.toString()}`;

  try{
    const response = await axios.get(requestURL, { headers });
    const now = moment();
    const fileName = `${apiType.dataname}/${now.format('YYYY-MM-DD')}/${now.format('HH-mm-ss')}.json`;

    await s3.putObject({
      Bucket: S3_SERVER_ACCESS_LOGS_USE_BUCKET_POLICY,
      Key: fileName,
      Body: JSON.stringify(response.data),
      ContentType: 'application/json'
    }).promise();
    console.log(`Successfully saved ${apiType.dataname} to S3.`);
    return response.data;
  }catch(error){
    console.error(`Failed to save ${apiType.dataname} to S3.`, error);
    return error;
  }
}

module.exports.handler = async(event)=>{
  const results = [];
  const errors = [];

  for(const apiType of apiTypes){
    try{
      const result = await callApiAndSaveToS3(apiType);
      results.push({ apiType: apiType.dataname, status: 'success', data: result });
    }catch(error){
      errors.push({ apiType: apiType.dataname, status: 'error', message: error.message });
    }
  }

  const response ={
    statusCode: errors.length > 0 ? 500 : 200,
    body: JSON.stringify({ results, errors })
  };

  return response;
}
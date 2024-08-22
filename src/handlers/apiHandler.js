const axios = require('axios');
const AWS = require('aws-sdk');
const moment = require('moment');
const s3 = new AWS.S3();


const dataname = 'WeatherAlert';
const servicepath = '/'+ dataname;

module.exports.callExternalApi = async (event) => {
  console.log('Environment variables:', process.env);
  try {
    const headers = {
      'fiware-service': process.env.FIWARE_SERVICE,
      'fiware-servicepath': servicepath,
      'x-request-trace-id': process.env.REQUEST_TRACE_ID,
      'apikey': process.env.API_KEY
    };
    console.log('Calling external API with headers:', headers);
    const entityId = 'jp.smartcity-yaizu.'+ dataname+'.1';
    const param =  new URLSearchParams({
      type: dataname
    });
    requestURL = process.env.EXTERNAL_API_URL + entityId +'?'+param.toString();
    const response = await axios.get(requestURL, {headers});
    const now = moment();
    console.log('API response:', response.data);
    const key = `${dataname}/${now.format('YYYY-MM-DD')}/${now.format('HH-mm-ss')}.json`;
    await s3.putObject({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: JSON.stringify(response.data),
      ContentType: 'application/json'
    }).promise();

    return { statusCode: 200, body: JSON.stringify(response.data) };
  } catch (error) {
    console.error('Error calling API:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to call external API' }) };
  }
};
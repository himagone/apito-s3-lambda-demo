const {handler, formatData } = require('../src/main');
const mockResponses = require('./mockResponses');
const axios = require('axios');

jest.mock('../src/apiTypes', () => [
  { dataname: 'EvacuationInformationSediment', entityId: 'Place' }
]);

const mockApi = (response) => {
  return jest.spyOn(axios, 'get').mockResolvedValue(response);
};

describe('Lambda Normal Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi(mockResponses.evacuation);
  });

  test(`convertFormatJson test`, async () => {
    const response = await axios.get('/test');
    const result = formatData(response.data, 'EvacuationInformationSediment');
    result.forEach((item) => {
      expect(item).toHaveProperty('AlertLevel');
      expect(item).toHaveProperty('Identification');
    })
  });
  test('formatData returns data unchanged if no formatter exists', () => {
    const unformattedData = [{ id: 3, name: 'Unformatted' }];
    const result = formatData(unformattedData, 'NonExistingDataType');
    expect(result).toEqual(unformattedData);
  });
  test('formatData handles empty data', () => {
    const emptyData = [];
    const result = formatData(emptyData, 'EvacuationInformationSediment');
    expect(result).toEqual([]);
  });
});

const errorCases = [
  {
    name: 'EMPTY DATA with status code 200',
    mockResponse: mockResponses.partialData,
  },
  {
    name: 'empty with status code 200',
    mockResponse: mockResponses.emptyData,
  },
  {
    name: 'null with status code 200',
    mockResponse: mockResponses.nullData,
  },
  {
    name: 'data not Exist with status code 200',
    mockResponse: mockResponses.nonExistData,
  },
  {
    name: 'status code 400',
    mockResponse: mockResponses.clientError,
  },
  {
    name: 'status code 500',
    mockResponse: mockResponses.serverError,
  },
];

errorCases.forEach(({ name, mockResponse }) => {
  describe('Lambda Error Handler Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockApi(mockResponse);
    });

    test(`Error handling is fine when ${name}`, async () => {
      const result = await handler();
      const body = JSON.parse(result.body);
      expect(result.statusCode).toBe(500);
      expect(body[0].status).toEqual('error');
      expect(body[0].message).toEqual(expect.any(String));
    });
  });
});
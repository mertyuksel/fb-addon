
/******************** REQUIRED *******************/
// required 
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1c7lU83nFRCi6GbSZGWR1nTARlzV3KLvW4-lW7UNJ2hM/edit#gid=0'   

// required 
const TAB_NAME = 'Sheet1'

// required
const ACCOUNT_ID = '4653630351333052'

// required
const TOKEN = 'EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU'


/******************** OPTIONAL *******************/
// optional
const LEVEL = ''

// optional
const FIELDS = ''

// optional
const DATE_PRESET = ''

// optional
const TIME_INCREMENT = ''

// optional
const FILTERING = ''  

// optional  
const BREAKDOWNS = '' 


function getFacebookAdsData() {

  const baseUrl = `https://graph.facebook.com/v10.0/act_${ACCOUNT_ID}/insights?access_token=${TOKEN}&level=${LEVEL}&fields=${FIELDS}&date_preset=${DATE_PRESET}&time_increment=${TIME_INCREMENT}&filtering=${FILTERING}&breakdowns=${BREAKDOWNS}&limit=500`
    const encodedUrl = encodeURI(baseUrl);  

  var response = UrlFetchApp.fetch(encodedUrl, {'method' : 'post'});  
  const data = JSON.parse(response.getContentText());
  const REPORT_ID = data.report_run_id;
 
  const checkUrl = `https://graph.facebook.com/v10.0/${REPORT_ID}?access_token=${TOKEN}`;
  var checkAsync = UrlFetchApp.fetch(checkUrl);
  var checkResponse = JSON.parse(checkAsync.getContentText());

  const spreadSheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const sheet = spreadSheet.getSheetByName(TAB_NAME);
  sheet.clear();

  while (checkResponse.async_status != "Job Completed")
  {
    Logger.log(checkResponse.async_status)
    Utilities.sleep(2000);
    checkAsync = UrlFetchApp.fetch(checkUrl);
    checkResponse = JSON.parse(checkAsync.getContentText());
  }

  const reportUrl = `https://www.facebook.com/ads/ads_insights/export_report?report_run_id=${REPORT_ID}&format=csv&access_token=${TOKEN}`;
  const csv = UrlFetchApp.fetch(reportUrl);  
  const csvData  = Utilities.parseCsv(csv);
  

  csvData.length // 2
 

  Logger.log(csvData); // 	[[], [No data available.]]


  // csvData.length = 2 CIKIYOR. 
  sheet.getRange(1,1, csvData.length, csvData[0].length).setValues(csvData);

  Logger.log(checkResponse.async_status)
}


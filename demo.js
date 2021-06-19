/******************** REQUIRED *******************/

// required 
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1c7lU83nFRCi6GbSZGWR1nTARlzV3KLvW4-lW7UNJ2hM/edit#gid=0'   

// required 
const SHEET_TAB_NAME = 'temp'

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
  const jsonResponse = JSON.parse(response.getContentText());
  const REPORT_ID = jsonResponse.report_run_id;

  const spreadSheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const sheet = spreadSheet.getSheetByName(SHEET_TAB_NAME);
  sheet.clear();

  const checkUrl = `https://graph.facebook.com/v10.0/${REPORT_ID}?access_token=${TOKEN}`;
  var checkAsync = UrlFetchApp.fetch(checkUrl);
  var checkResponse = JSON.parse(checkAsync.getContentText());

  while (checkResponse.async_status != "Job Completed")
  {
    Utilities.sleep(2000);
    checkAsync = UrlFetchApp.fetch(checkUrl);
    checkResponse = JSON.parse(checkAsync.getContentText());
  }
  const reportUrl = `https://www.facebook.com/ads/ads_insights/export_report?report_run_id=${REPORT_ID}&access_token=${TOKEN}&format=csv`;
  const csv = UrlFetchApp.fetch(reportUrl);  
  const csvData  = Utilities.parseCsv(csv);
  
  sheet.getRange(1,1, csvData.length, csvData[0].length).setValues(csvData);
}

/******************** REQUIRED *******************/

const SPREADSHEET_URL = ''   

const SHEET_TAB_NAME = ''

const ACCOUNT_ID = ''

const TOKEN = ''

/******************** OPTIONAL *******************/

const LEVEL = ''

const FIELDS = ''

const DATE_PRESET = ''

const TIME_INCREMENT = ''

const FILTERING = ''  

const BREAKDOWNS = '' 


function getFacebookAdsData() {

  const baseUrl = `https://graph.facebook.com/v14.0/act_${ACCOUNT_ID}/insights?access_token=${TOKEN}&level=${LEVEL}&fields=${FIELDS}&date_preset=${DATE_PRESET}&time_increment=${TIME_INCREMENT}&filtering=${FILTERING}&breakdowns=${BREAKDOWNS}&limit=500`
  const encodedUrl = encodeURI(baseUrl);  

  var response = UrlFetchApp.fetch(encodedUrl, {'method' : 'post'});  
  const jsonResponse = JSON.parse(response.getContentText());
  const REPORT_ID = jsonResponse.report_run_id;

  const spreadSheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const sheet = spreadSheet.getSheetByName(SHEET_TAB_NAME);
  sheet.clear();

  const checkUrl = `https://graph.facebook.com/v14.0/${REPORT_ID}?access_token=${TOKEN}`;
  var checkAsync = UrlFetchApp.fetch(checkUrl);
  var checkResponse = JSON.parse(checkAsync.getContentText());

  while (checkResponse.async_status != "Job Completed")   
  {
    Utilities.sleep(2000);
    checkAsync = UrlFetchApp.fetch(checkUrl);
    checkResponse = JSON.parse(checkAsync.getContentText());
    
    if(checkResponse.async_status == "Job Failed")
    {
      Logger.log(checkResponse.async_status);
      return;
    }
  }
  const reportUrl = `https://www.facebook.com/ads/ads_insights/export_report?report_run_id=${REPORT_ID}&access_token=${TOKEN}&format=csv`;
  const csv = UrlFetchApp.fetch(reportUrl);  
  const csvData  = Utilities.parseCsv(csv);
  
  sheet.getRange(1,1, csvData.length, csvData[0].length).setValues(csvData);
}

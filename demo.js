const TOKEN = 'EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU'

const COMPLETE_URL = 'https://graph.facebook.com/v10.0/act_4653630351333052/insights?level=campaign&export_format=xls&fields=impressions&date_preset=yesterday&access_token=EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU&time_increment=1&filtering=[{field:"action_type",operator:"IN",value:[\'mobile_app_install\']}]&limit=1000'

const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1c7lU83nFRCi6GbSZGWR1nTARlzV3KLvW4-lW7UNJ2hM/edit#gid=0'

const TAB_NAME = 'Sheet1'


// **** DO NOT MODIFY ANTHING BELOW **** 

var REPORT_ID; 

function requestFacebookReport() {
 
  const encodedFacebookUrl = encodeURI(COMPLETE_URL);
  
  const options = {'method' : 'post'};
  const fetchRequest = UrlFetchApp.fetch(encodedFacebookUrl, options);  
  const results = JSON.parse(fetchRequest.getContentText());
  
  REPORT_ID = results.report_run_id;
}


function getFacebookReport() {
  
  // Selects the chosen sheet and tab
  const spreadSheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const sheet = spreadSheet.getSheetByName(TAB_NAME);
  
  // Clears the sheet
  sheet.clear();
  
  // Control if async is done or not. 
  const url = `https://graph.facebook.com/v10.0/${REPORT_ID}?access_token=${TOKEN}`;
  var fetchRequest = UrlFetchApp.fetch(url);
  var results = JSON.parse(fetchRequest.getContentText());

  while (results.async_status != "Job Completed")
  {
    Logger.log(results.async_status)
    Utilities.sleep(2000);
    fetchRequest = UrlFetchApp.fetch(url);
    results = JSON.parse(fetchRequest.getContentText());
  }

  const insightURL = `https://graph.facebook.com/v10.0/${REPORT_ID}/insights?access_token=${TOKEN}&export_format=csv`;
  fetchRequest = UrlFetchApp.fetch(insightURL);

  //const results1 = JSON.parse(literal);

  //const results1 = Utilities.parseCsv(literal);
  //sheet.getRange(1,1, results1.getLength(), results1[0].length).setValues(results1);
  

  var csvData = Utilities.parseCsv(fetchRequest);  // Exception: Could not parse text. Hatasi aliyorum. 
  sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);

  // TODO: buraya json to sheet yapilcak  
  Logger.log(results.async_status)
}




function runApp() {
  requestFacebookReport();
  getFacebookReport();
}


/*

'{"data": [ { "event_name": "Purchase", "event_time": 1622209315, "user_data": { "em": [ "309a0a5c3e211326ae75ca18196d301a9bdbd1a882a4d2569511033da23f0abd" ], "ph": [ "254aa248acb47dd654ca3ea53f48c2c26d641d23d7e2e93a1ec56258df7674c4", "6f4fcb9deaeadc8f9746ae76d97ce1239e98b404efe5da3ee0b7149740f89ad6" ], "client_ip_address": "123.123.123.123", "client_user_agent": "$CLIENT_USER_AGENT", "fbc": "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890", "fbp": "fb.1.1558571054389.1098115397" }, "contents": [ { "id": "product123", "quantity": 1, "delivery_category": "home_delivery" } ], "custom_data": { "currency": "usd", "value": 123.45 }, "event_source_url": "http://jaspers-market.com/product/123", "action_source": "website" } ]}'

*/

/*

asyn job sonucu ogrenmek icin link:

https://graph.facebook.com/v10.0/478204073432587/insights?access_token=EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU


https://graph.facebook.com/v10.0/1670232720033688?access_token=EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU

*/



/*

https://graph.facebook.com/v10.0/act_4653630351333052/insights?level=campaign&export_format=xls&fields=impressions&date_preset=yesterday&access_token=EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU&time_increment=1&filtering=[{field:"action_type",operator:"IN",value:['mobile_app_install']}]&limit=1000

*/



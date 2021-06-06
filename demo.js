
const SPREADSHEET_URL = ''

const TAB_NAME = ''

const ACCOUNT_ID = ''

const TOKEN = ''

const LEVEL = ''

const FIELDS = ''

const DATE_PRESET = ''

const TIME_INCREMENT = ''

const FILTERING = ''  

// TODO: encoding islemine ihtiyac duyuyor. birde encode etmeden dene bakalim encodeURI kullanmadan.
// filtering kismi kesinlkle encoding ihtiyac duyuyor parantez ve tirnak isareti kisimlari gibi. 
// eger yapmaz isen UrlFetch calismiyor. invalid argument oluyor. 

// TODO: parametrenin value kismi eksik oldugunda ne olur. teklide bu yasaniyor.  TEST ET. 

function getFacebookAdsData() {

  const baseUrl = `https://graph.facebook.com/v10.0/act_${ACCOUNT_ID}/insights?level=${LEVEL}&fields=${FIELDS}&date_preset=${DATE_PRESET}&access_token=${TOKEN}&time_increment=${TIME_INCREMENT}&filtering=${FILTERING}&limit=500`
  
  // filtering kismi icin gerekli. 
  const encodedUrl = encodeURI(baseUrl);  
  
  // TODO: output incele gercekten encode ediyor mu nasil ediyor bak.
  Logger.log(encodedUrl) 

  var response = UrlFetchApp.fetch(encodedUrl, {'method' : 'post'});  
  const data = JSON.parse(response.getContentText());
  const REPORT_ID = data.report_run_id;

  const spreadSheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const sheet = spreadSheet.getSheetByName(TAB_NAME);
  
  sheet.clear();
  
  // ENCODING GEREKSIZ DENEDIM. 
  const checkUrl = `https://graph.facebook.com/v10.0/${REPORT_ID}?access_token=${TOKEN}`;
  var checkAsync = UrlFetchApp.fetch(checkUrl);
  var checkResponse = JSON.parse(checkAsync.getContentText());

  while (checkResponse.async_status != "Job Completed")
  {
    Logger.log(checkResponseresponse.async_status)
    Utilities.sleep(2000);
    checkAsync = UrlFetchApp.fetch(url);
    checkResponse = JSON.parse(checkAsync.getContentText());
  }

  // ENCODING GEREKSIZ DENEDIM. 
  const insightUrl = `https://graph.facebook.com/v10.0/${REPORT_ID}/insights?access_token=${TOKEN}&export_format=csv`;
  rawAdsData = UrlFetchApp.fetch(insightUrl);

  var csvData = Utilities.parseCsv(rawAdsData);  
  sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);

  Logger.log(results.async_status)
}


/*

const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1c7lU83nFRCi6GbSZGWR1nTARlzV3KLvW4-lW7UNJ2hM/edit#gid=0'

const TAB_NAME = 'Sheet1'

const TOKEN = 'EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU'

const COMPLETE_URL = 'https://graph.facebook.com/v10.0/act_4653630351333052/insights?level=campaign&export_format=xls&fields=impressions&date_preset=yesterday&access_token=EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU&time_increment=1&filtering=[{field:"action_type",operator:"IN",value:[\'mobile_app_install\']}]&limit=500'

https://graph.facebook.com/v10.0/act_4653630351333052/insights?level=campaign&export_format=xls&fields=impressions&date_preset=yesterday&access_token=EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU&time_increment=1&filtering=[{field:%22action_type%22,operator:%22IN%22,value:[\%27mobile_app_install\%27]}]&limit=500






var REPORT_ID; 


// put your complete URL you've already prepared 
const COMPLETE_URL = 'COMPLETE_URL'



// complete spreadsheet URL 
const SPREADSHEET_URL = 'SPREADSHEET_URL'

// spreadsheet tab name (like Sheet1)
const TAB_NAME = 'TAB_NAME'

// facebook ad account ID 
const ACCOUNT_ID = 'ACCOUNT_ID'

// user access token from the facebook app you've created
const TOKEN = 'TOKEN'

*/



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


// parametrelerin sag tarafi bos olmali mert -- biri doldurmadan fetch yaptiginda hata vermesin diye. 

// her parametre ayri sekilde olucak hepsinin detayli anlatimi websitesinde olucak merak etme burada link aciklama vs vermeyeceksin. 
// degisken isimlerini degistirmeyi unutma. 



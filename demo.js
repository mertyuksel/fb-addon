
/******************************************************************/

// required 
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1c7lU83nFRCi6GbSZGWR1nTARlzV3KLvW4-lW7UNJ2hM/edit#gid=0'   

// required 
const TAB_NAME = 'Sheet1'

// required
const ACCOUNT_ID = '4653630351333052'

// required
const TOKEN = 'EAAExgau2As4BAKgfoPN84jbun6jUJM7Vd9cOvjyUbhj610ZB2H1ZCgrouYEcZBl58QmYNZA3TqR1JkQ25CzC7O7ZAYH5Dw8LJHpdiTkfRbZB3dNZCPasEVZCx4EWamIQt7aJUyWHGo6NMCsFyDNiK7AeqfODI5WZBd9L9O4sCZCmBRSPvAj0ATKxaU'

// optional
const LEVEL = ''

// optional
const FIELDS = ''

// optional
const DATE_PRESET = ''

// optional
const TIME_INCREMENT = ''

// optional
const FILTERING = ''  // "[{'field':'action_type','operator':'IN','value':['link_click']}]"

// optional  
const BREAKDOWNS = '' 


function getFacebookAdsData() {

  const baseUrl = `https://graph.facebook.com/v10.0/act_${ACCOUNT_ID}/insights?level=${LEVEL}&fields=${FIELDS}&date_preset=${DATE_PRESET}&access_token=${TOKEN}&time_increment=${TIME_INCREMENT}&filtering=${FILTERING}&limit=500`
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


/*
// PART1  
  
  const insightUrl = `https://graph.facebook.com/v10.0/${REPORT_ID}/insights?access_token=${TOKEN}&export_format=csv`;
  rawAdsData = UrlFetchApp.fetch(insightUrl);

  // parser calismasi icin veri bu kivama gelmeli "a,b,c\nd,e,f" 
  // bir sonraki adim -- bu bizim adamin ki nasil calisiyor csv olarak export edeni diyorum bi ona bak bakalim. calistir en bastan.

  // json dosyasindan json movie data okudum ama parseCsv() onu parse etmedi. 
  var csvData = Utilities.parseCsv(rawAdsData);  
  sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
*/
/*
{
   "data": [
      
   ],
   "paging": {
      "cursors": {
         "before": "MAZDZD",
         "after": "LTEZD"
      }
   }
}

PARSING HATASI VERIYOR. YUKARIDAKI LINKIN OUTPUT'U 
export_format=csv BUNU BUNA CEVIRDIM format=csv HALA DOSYA DONDURMUYOR LINK   = graph api da bu ozellik yokmus kankam export_format yani. 
TODO: yukaridaki linkin output alma parametrelerine dokumantasyondan bir daha kontrol et nedense alttaki gibi csv dondurmuyor. 

// graph api export olayina sahip degilmis -- bu link degerli
// https://stackoverflow.com/questions/48410866/in-the-fb-marketing-api-there-is-an-option-to-export-format-csv-how-do-i-do 

*/



  // PART2
  // Olmadi direkt bununla birlikte bi yayinlariz. 
  // Fetches the report as a csv file
  const url = `https://www.facebook.com/ads/ads_insights/export_report?report_run_id=${REPORT_ID}&format=csv&access_token=${TOKEN}`;
  const fetchRequest = UrlFetchApp.fetch(url);  // .getContentText(); bu ne is yapiyor bunu dene belki bundan olmuyor yukarida. 
  Logger.log(fetchRequest.getContentText);
  const results = Utilities.parseCsv(fetchRequest);
  
  // Pastes the csv file in the sheet
  sheet.getRange(1,1, results.length, results[0].length).setValues(results);


/*

OUTPUT DIREKT OLARAK CSV DOSTUM BURADA --- VE ICINDE DIREKT OLARAK "NO DATA AVAILABLE" YAZIYOR 
*/


  Logger.log(checkResponse.async_status)

}
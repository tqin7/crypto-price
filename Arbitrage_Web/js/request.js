
window.onload = function() {

  localStorage.setItem("data", "Time,Coinbase,Best Market\n");

  var cryptonator = 'https://api.cryptonator.com/api/full/btc-usd';
  var ctt = createCorsRequest('GET', cryptonator);
  //console.log("Cryptocompare");
  console.log(ctt);


  //localStorage.setItem("timeElapsed", 0);

  setInterval(function() {updateData(localStorage.getItem("data"))}, 10000);

  setInterval(function() {updateGraph(localStorage.getItem("data"))}, 20000);

  //writeToFile();

}

function updateData(priceData) {

  var coinbase = 'https://api.coinbase.com/v2/exchange-rates?currency=BTC';
  var cb = createCorsRequest('GET', coinbase);
  //console.log("Coinbase: ");
  //console.log(cb);

  //var cryptocompare = 'https://www.cryptocompare.com/api/data/coinlist/';
  //var cryptocompare = 'https://min-api.cryptocompare.com';
  //var cc = createCorsRequest('GET', cryptocompare);
  var cryptoCoins = 'http://api.cryptocoincharts.info/tradingPair/btc_usd';
  var crc = createCorsRequest('GET', cryptoCoins);
  //console.log("Cryptocompare");
  console.log(crc);



  var coinbasePrice = parseFloat(cb.data.rates.USD);
  var bestCrcMarketIndex= 0;
  for (var i = 1; i < 3; i++) {
    if (crc.markets[i].price < crc.markets[bestCrcMarketIndex].price) {
      bestCrcMarketIndex = i;
    }
  }
  var bestCrcMarketName = crc.markets[bestCrcMarketIndex].market;
  var bestCrcMarketPrice = parseFloat(crc.markets[bestCrcMarketIndex].price);


  var t = new Date().getTime();
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var year = day * 365;
  var daysPast2017 = Math.round((t - 47 * year) / day);
  

  localStorage.setItem("data", priceData + "\n" + 
    daysPast2017 + "," + coinbasePrice + "," + bestCrcMarketPrice);

  //localStorage.setItem("timeElapsed", localStorage.getItem("timeElapsed") + 10);
  //storeData(t, coinbasePrice, bestCrcMarketPrice);
  
  console.log("CBPRICE: " + coinbasePrice);
  console.log("CRCName: " + bestCrcMarketName);
  console.log("CRCPrice: " + bestCrcMarketPrice);

}

function updateGraph(data) {
  var cgraph = new Dygraph(
      document.getElementById("bestGraphEver"), data,
      {
        drawPoints: true,
        //showRoller: true,
        //valueRange: [1200, 2501],
      }
  );
}

/** Get Data from API*/
function createCorsRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        console.log("withCredentials");
        xhr.open(method, url, false);
        xhr.send();
        console.log("Status: " + xhr.status);
        console.log("Readystate: " + xhr.readyState);
        if (xhr.readyState == 4 && xhr.status == 200) {
          return JSON.parse(xhr.response);
        }
      

      } else if (typeof XDomainRequest != "undefined") {
        console.log("XDomainRequest");
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {
      console.log("supported");
        xhr = null;
    }
    return xhr;
}

function storeData(time, price1, price2) {
  var fh = new File([""], "../data.txt");
  fh.open("w");
  fh.WriteLine(time+ ',' + price1 + ',' + price2);
  fh.Flush();
  fh.Close();
}


function writeToFile() {
    $.ajax({
        type: "POST",
        url: "file:///E:/Documents/Berkeley/Blockchain/Contracts/Ethereum-Projects/Arbitrage_Web/html/saveData.py",
        //data: { param: input },
        //dataType: "text",
        success: callbackFunc
    });
}

function callbackFunc(response) {
  console.log(response);
}



/* 
window.onload = function() {
  
  var data = [];

  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var year = day * 365;

  setInterval(function() {updateData(data)}, 4000);

  setInterval(function() {updateGraph(data)}, 8000);

  //writeToFile();

}

function writeToFile() {
    $.ajax({
        type: "POST",
        url: "file:///E:/Documents/Berkeley/Blockchain/Contracts/Ethereum-Projects/Arbitrage_Web/html/saveData.py",
        //data: { param: input },
        //dataType: "text",
        success: callbackFunc
    });
}

function callbackFunc(response) {
  console.log(response);
}

function updateData(priceData) {

  console.log(priceData);

  var coinbase = 'https://api.coinbase.com/v2/exchange-rates?currency=BTC';
  var cb = createCorsRequest('GET', coinbase);
  console.log("Coinbase: ");
  console.log(cb);

  //var cryptocompare = 'https://www.cryptocompare.com/api/data/coinlist/';
  //var cryptocompare = 'https://min-api.cryptocompare.com';
  //var cc = createCorsRequest('GET', cryptocompare);
  var cryptoCoins = 'http://api.cryptocoincharts.info/tradingPair/btc_usd';
  var crc = createCorsRequest('GET', cryptoCoins);
  console.log("Cryptocompare");
  console.log(crc);

  var coinbasePrice = parseFloat(cb.data.rates.USD);
  var bestCrcMarketIndex= 0;
  for (var i = 1; i < 3; i++) {
    if (crc.markets[i].price < crc.markets[bestCrcMarketIndex].price) {
      bestCrcMarketIndex = i;
    }
  }
  var bestCrcMarketName = crc.markets[bestCrcMarketIndex].market;
  var bestCrcMarketPrice = parseFloat(crc.markets[bestCrcMarketIndex].price);

  var t = new Date().getTime();

  priceData.push([t, coinbasePrice, bestCrcMarketPrice]);
  storeData(t, coinbasePrice, bestCrcMarketPrice);
  
  console.log("CBPRICE: " + coinbasePrice);
  console.log("CRCName: " + bestCrcMarketName);
  console.log("CRCPrice" + bestCrcMarketPrice);

}

function updateGraph(data) {
  var cgraph = new Dygraph(
      document.getElementById("bestGraphEver"), data,
      {
        drawPoints: true,
        //showRoller: true,
        //valueRange: [1200, 2501],
        labels: ["Time", "Coinbase Price", "Lowest Price"]
      }
  );
}

/** Get Data from API
function createCorsRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        console.log("withCredentials");
        xhr.open(method, url, false);
        xhr.send();
        console.log("Status: " + xhr.status);
        console.log("Readystate: " + xhr.readyState);
        if (xhr.readyState == 4 && xhr.status == 200) {
          return JSON.parse(xhr.response);
        }
      

      } else if (typeof XDomainRequest != "undefined") {
        console.log("XDomainRequest");
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {
      console.log("supported");
        xhr = null;
    }
    return xhr;
}

function storeData(time, price1, price2) {
  var fh = new File([""], "../data.txt");
  fh.open("w");
  fh.WriteLine(time+ ',' + price1 + ',' + price2);
  fh.Flush();
  fh.Close();
} */
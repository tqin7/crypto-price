
window.onload = function() {
  
  var data = [];

  setInterval(function() {updateData(data)}, 4000);

    setInterval(function() {updateGraph(data)}, 8000);


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

  priceData.push([coinbasePrice, bestCrcMarketPrice]);
  
  console.log("CBPRICE: " + coinbasePrice);
  console.log("CRCName: " + bestCrcMarketName);
  console.log("CRCPrice" + bestCrcMarketPrice);

}

function updateGraph(data) {
  var cgraph = new Dygraph(
      document.getElementById("bestGraphEver"), data,
      {
        drawPoints: true,
        showRoller: true,
        //valueRange: [1200, 1250],
        labels: ["Coinbase Price", "Lowest Price" ]
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
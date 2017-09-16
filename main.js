const {app, BrowserWindow, TouchBar} = require('electron')
const request = require('request')
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar

const bitcoinLabel = new TouchBarLabel({
  label: "Fetching BTC-USD..."
})

const etherLabel = new TouchBarLabel({
  label: "Fetching ETH–USD..."
})

const fetchPrices = () => {
  request('https://api.cryptonator.com/api/ticker/btc-usd', (error, response, body) => {
    if(!error && response.statusCode == 200) { 
      bitcoinLabel.label = `1฿ = $${ parseFloat(JSON.parse(body).ticker.price).toFixed(2) }`
    }
  });

  request('https://api.cryptonator.com/api/ticker/eth-usd', (error, response, body) => {
    if(!error && response.statusCode == 200) { 
      etherLabel.label = `1Ξ = $${ parseFloat(JSON.parse(body).ticker.price).toFixed(2) }`
    }
  });
}

let interval = setInterval(fetchPrices, 10000)

const touchBar = new TouchBar([
  bitcoinLabel,
  new TouchBarSpacer({size: 'small'}),
  etherLabel
])

let window

app.once('ready', () => {
  window = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden-inset',
    width: 200,
    height: 200,
    backgroundColor: '#000'
  })
  window.loadURL('about:blank')
  window.setTouchBar(touchBar)
  fetchPrices();
})
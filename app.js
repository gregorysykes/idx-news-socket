const app = require('express')()
const http = require('http').createServer(app)


const io = require('socket.io')(http)


//get data from IQ+
const net = require('net')
const { send } = require('process')
const port_iqp = 8888
// const host = '203.128.77.46'
const host = '192.168.1.30'

const client = new net.Socket();

client.connect({port:port_iqp,host:host},function(){
    console.log('getting')
})

count = 0
news = ''
all_news = []
temp_title = ''
resp = '[-]'

indices = [
    {code:'SHCI',name:'Shanghai Composite', price:0, change:0},
    {code:'AORD',name:'All Ordinaries Australia', price:0, change:0},
    {code:'BSE30',name:'BSE 30 Bombay', price:0, change:0},
    {code:'BSET',name:'Thailand Stock Exchange', price:0, change:0},
    {code:'DJIA',name:'Dow Jones Industrial Average', price:0, change:0},
    {code:'CAC40',name:'CAC 40 Paris', price:0, change:0},
    {code:'FTSE',name:'FTSE 100 London', price:0, change:0},
    {code:'GDAXI',name:'DAX Xetra Frankfurt', price:0, change:0},
    {code:'SPX',name:'S&P 500', price:0, change:0},
    {code:'HSI',name:'Hangseng Index', price:0, change:0},
    {code:'NDXI',name:'Nasdaq Composite', price:0, change:0},
    {code:'KLSE',name:'Kuala Lumpur Stock Exchange', price:0, change:0},
    {code:'KOSPI',name:'Korea Composite', price:0, change:0},
    {code:'N225',name:'Nikkei 225 Osaka', price:0, change:0},
    {code:'PSE',name:'Philippine Stock Exchange', price:0, change:0},
    {code:'STI',name:'Straits Times Singapore', price:0, change:0},
    {code:'TWSE',name:'Taiwan Stock Exchange', price:0, change:0},
]

commodities = [
    {code:'LCONY',name:'L. Crude Oil NYM', price:0, change: 0},
    {code:'CPOKL',name:'CPO KLCE', price:0, change: 0},
    {code:'LFAL',name:'Aluminum Cash LME ', price:0, change: 0},
    {code:'LFCU',name:'Copper Cash LME ', price:0, change: 0},
    {code:'LFNI',name:'Nickel Cash LME ', price:0, change: 0},
    {code:'LFSN',name:'Tin Cash LME', price:0, change: 0},
    {code:'LGD',name:'LOCO LDN Gold ', price:0, change: 0},
    {code:'LPL',name:'LOCO LDN Platinum ', price:0, change: 0},
    {code:'LSI',name:'LOCO LDN Silver ', price:0, change: 0},
    {code:'RPMAS',name:'Emas Rp', price:0, change: 0}
]

currencies = [
    {code:'EUR-USD',name:'EUR/USD', price:0, change:0},
    {code:'GBP-USD',name:'GBP/USD', price:0, change:0},
    {code:'AUD-IDR',name:'AUD/IDR', price:0, change:0},
    {code:'EUR-IDR',name:'EUR/IDR', price:0, change:0},
    {code:'GBP-IDR',name:'GBP/IDR', price:0, change:0},
    {code:'HKD-IDR',name:'HKD/IDR', price:0, change:0},
    {code:'JPY-IDR',name:'JPY/IDR', price:0, change:0},
    {code:'KRW-IDR',name:'KRW/IDR', price:0, change:0},
    {code:'NZD-IDR',name:'NZD/IDR', price:0, change:0},
    {code:'SAR-IDR',name:'SAR/IDR', price:0, change:0},
    {code:'SGD-IDR',name:'SGD/IDR', price:0, change:0},
    {code:'THB-IDR',name:'THB/IDR', price:0, change:0},
    {code:'USD-IDR',name:'USD/IDR', price:0, change:0},
    {code:'MYR-IDR',name:'MYR/IDR', price:0, change:0},
    {code:'CNY-IDR',name:'CNY/IDR', price:0, change:0}
]



client.on('data', function(chunk){
    
    string = chunk.toString().split('\r\n')
    resp = string
    str = string[0].toString().split('|')

    //remove index when array size 100
    if(all_news.length == 100){
        all_news.pop()
    }

    //select if news
    if(str[1] == '1'){
        quote = str[2].split(';')[1]
        temp_quotePrice = ''
        temp_quoteChange = ''
        arrayLength = str.length
        for(i=0;i<arrayLength;i++){
            if(str[i].startsWith('56')){
                temp_quotePrice = str[i].split(';')[1]
            }else if(str[i].startsWith('82')){
                temp_quoteChange = str[i].split(';')[1]
            }
        }
        if(quote.startsWith('-')){
            temp_quote = quote.substring(1)
            
            if(searchIndex(temp_quote, commodities) != null){
                if(temp_quoteChange != ''){
                    commodities[searchIndex(temp_quote, commodities)].change = parseFloat(temp_quoteChange)
                }
                if(temp_quotePrice != ''){
                    commodities[searchIndex(temp_quote, commodities)].price = parseFloat(temp_quotePrice)
                }
            }else if(searchIndex(temp_quote, indices) != null){
                if(temp_quoteChange != ''){
                    indices[searchIndex(temp_quote, indices)].change = parseFloat(temp_quoteChange)
                }
                if(temp_quotePrice != ''){
                    indices[searchIndex(temp_quote, indices)].price = parseFloat(temp_quotePrice)
                }
            }

            
            // if(commodities[temp_quote] != null){
            //     if(temp_quoteChange != ''){
            //         commodities[temp_quote].change = parseFloat(temp_quoteChange)
            //     }
            //     if(temp_quotePrice != ''){
            //         commodities[temp_quote].price = parseFloat(temp_quotePrice)
            //     }
            // }else if(indices[temp_quote] != null){
            //     if(temp_quoteChange != ''){
            //         indices[temp_quote].change = parseFloat(temp_quoteChange)
            //     }
            //     if(temp_quotePrice != ''){
            //         indices[temp_quote].price = parseFloat(temp_quotePrice)
            //     }
            // }
        }else{
            //currencies
            if(searchIndex(quote, currencies) != null){
                if(temp_quoteChange != ''){
                    currencies[searchIndex(quote, currencies)].change = parseFloat(temp_quoteChange)
                }
                if(temp_quotePrice != ''){
                    currencies[searchIndex(quote, currencies)].price = parseFloat(temp_quotePrice)
                }
            }
            // console.log(currencies)
        }
    }else if(str[1] == 'd'){
        // console.log(str)
        //news
        newsLength = str[3]
        newsIndex = str[4]
        newsDate = str[6]
        newsTime = str[7]
        newsTag = str[9]
        newsTitle = str[10]
        text = str[11]
        
        if(newsLength == 0){
            if(all_news.length > 1){
                if(all_news[0].title.replace(' ','') == newsTitle.replace(' ','')){
                    all_news.shift()
                }
            }

            all_news.unshift({
                'title':newsTitle,
                'tag':newsTag,
                'date':newsDate,
                'time':newsTime,
                'news':text
            })
            
        }else if(newsLength > newsIndex){
            if(temp_title != ''){
                if(temp_title == newsTitle){
                    count++
                }else{
                    news = ''
                    count = 1
                }
            }
            news += text
            temp_title = newsTitle
        }else if(newsLength == newsIndex){
            temp_title = newsTitle
            if(news != ''){
                if(all_news.length > 1){
                    if(all_news[0].title.replace(' ','') == newsTitle.replace(' ','')){
                        all_news.shift()
                    }
                }
                if(count == newsLength){
                    news += text
                    all_news.unshift({
                        'title':newsTitle,
                        'tag':newsTag,
                        'date':newsDate,
                        'time':newsTime,
                        'news':news
                    })
                } 
                news = ''
                count = 0
                
            }
        }

    }
})

function searchIndex(str, arr){
    index = null
    for(i = 0; i < arr.length; i++){
        if(arr[i].code == str){
            index = i
            break
        }
    }
    return index;
}

app.get('/', (req, res) => {
    res.send("Welcome!!")
})

app.get('/news', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    json = JSON.stringify(all_news, null, 3)
    res.send(json)
})

app.get('/commodities', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    json = JSON.stringify(commodities, null, 3)
    res.send(json)
})

app.get('/currencies', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    json = JSON.stringify(currencies, null, 3)
    res.send(json)
})

app.get('/indices', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    json = JSON.stringify(indices, null, 3)
    res.send(json)
})


io.on('connection',(socket)=>{
	console.log('connected +1')
    // socket.on('news',(data)=>{
    //     socket.broadcast.emit('receive_message',data)
    // })
})
http.listen(process.env.PORT || 8899)

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port:8880});
wss.on('connection', (ws)=>{
    ws.on('message', (message)=>{
        console.log('message recieved', message);
        let inputValue = message.split(',');
        let arr = [];
        let temp=Number(inputValue[0]);
        while(temp<Number(inputValue[1])){
            temp = Number(temp) + Number(inputValue[2]);
            console.log(temp + "........");
            arr.push(temp)
        }
        console.log('arr', arr, inputValue);
        ws.send(arr.toString());

    })
})

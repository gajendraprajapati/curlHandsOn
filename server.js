const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const Pusher = require('pusher');
const mongoose = require("mongoose");


const pusher = new Pusher({
  appId: '729793',
  key: '0dc58685cd98594ff213',
  secret: '00564face9e3635aef19',
  cluster: 'ap2',
  encrypted: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/app')));

app.set('port', (process.env.PORT || 5000));
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/curlData");
let newSchema = new mongoose.Schema({
    data: Array,
});
let newInput = mongoose.model("newInput", newSchema);

let expensesList = {
    data: [
        {
            start: 10,
            end: 80,
            increment:2
        }
        
    ]
}
let arr = [];
let temp=expensesList.data[0].start;
while(temp<expensesList.data[0].end){
    temp = temp + expensesList.data[0].increment;
    arr.push(temp)
}
let tempObj = {
    tempData:[]
}
arr.map((currItem,index)=>{
    let a = {}
    a.value = currItem;
    a.index = index;
    tempObj.tempData.push(a);
})




app.get('/finances', (req,res) => {
    res.send(tempObj);
});

app.post('/expense/add', (req, res) => {
    let start = Number(req.body.start)
    let end = Number(req.body.end)
    let increment = Number(req.body.gradient);

    let newExpense  = {
        start: start,
        end: end,
        increment:increment
    };
    let arr = [];
    let temp=newExpense.start;
    while(temp<newExpense.end){
    temp = temp + newExpense.increment;
    arr.push(temp)
}
    let tempObj = {
    tempData:[]
    }
    arr.map((currItem,index)=>{
    let a = {}
    a.value = currItem;
    a.index = index;
    tempObj.tempData.push(a);
})
    let myData = new newInput(arr);
    myData.save()

    // expensesList.data.push(newExpense);

    pusher.trigger('finance', 'new-expense', {
        data: tempObj
    });

    res.send({
        success : true,
        data: tempObj
    })
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

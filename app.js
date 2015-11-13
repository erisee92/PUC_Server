var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    logger = require('morgan'),
    bodyParser = require('body-parser')

var userController = require('./controllers/user')
var sessionController = require('./controllers/session')


mongoose.connect('mongodb://127.0.0.1:27017/puc')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(logger('combined'))

app.get('/user',userController.index)
app.post('/user',userController.create)
app.put('/user/:userId',userController.update)
app.delete('/user/:userId',userController.delete)

app.get('/session',sessionController.index)
app.post('/session',sessionController.create)
app.put('/session/:sessionId',sessionController.update)
app.delete('/session/:sessionId',sessionController.delete)

app.listen(port,function(err) {
    console.log('listening on %s',port)
})
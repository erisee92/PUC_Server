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
app.use(logger('dev'))

app.get('/users',userController.index)
app.post('/users',userController.create)
app.put('/users/:userId',userController.update)
app.delete('/users/:userId',userController.delete)

app.get('/sessions',sessionController.index)
app.get('/sessions/:sessionId',sessionController.getSession)
app.post('/sessions',sessionController.create)
app.put('/sessions/:sessionId/state',sessionController.changeSessionState)
app.put('/sessions/:sessionId/users',sessionController.addNewUser)
app.delete('/sessions/:sessionId/users/:name',sessionController.deleteUser)
app.delete('/sessions/:sessionId',sessionController.delete)

app.use(function(req, res) {
  res.status(404).send('Nothing to see here!')
})

app.listen(port,function(err) {
    console.log('listening on %s',port)
})
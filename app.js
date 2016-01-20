var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    logger = require('morgan'),
    bodyParser = require('body-parser')

var userController = require('./controllers/user')
var sessionController = require('./controllers/session')

//Verbindung zur MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/puc')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(logger('dev'))

//Routen, die den User betreffen
app.get('/users',userController.index)
app.post('/users',userController.create)
app.put('/users/:userId',userController.update)
app.delete('/users/:username/session',userController.deleteSession)
app.delete('/users/:userId',userController.delete)

//Routen, die die Session betreffen
app.get('/sessions',sessionController.index)
app.get('/sessions/:sessionId',sessionController.getSession)
app.post('/sessions',sessionController.create)
app.put('/sessions/:sessionId/state',sessionController.changeSessionState)
app.put('/sessions/:sessionId/users',sessionController.addNewUser)
app.put('/sessions/:sessionId/users/:username',sessionController.updateUser)
app.delete('/sessions/:sessionId/users/:username',sessionController.deleteUser)
app.delete('/sessions/:sessionId',sessionController.delete)

//Wenn eine andere Route aufgerufen wird, wird ein Costum 404 Error ausgegeben
app.use(function(req, res) {
  res.status(404).send('Nothing to see here!')
})

app.listen(port,function(err) {
    console.log('listening on %s',port)
})
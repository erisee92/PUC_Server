var mongoose = require("mongoose"),
    Session = require("../models/session.js"),
    controller = {}

controller.index = [
    function(req, res) {
        res.end("PlaceHolder");
    }
]

controller.create = [
    function(req, res) {
        res.end("PlaceHolder");
    }
]
controller.update = [
    function(req, res) {
        res.end("PlaceHolder");
    }
]
controller.delete = [
    function(req, res) {
        res.end("PlaceHolder");
    }
]

module.exports = controller;
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var USER = require("../../database/usersModel");
/* GET home page. */
router.delete(/\/user\/\w{1,}/g, (req, res) => {
  url = req.url;
  var params = req.body;
  var idexp = /\w{20,}/g
  var ids = url.match(idexp);
  var id = ids[0];
  //Collection of data
  USER.find({_id: id}).remove().exec((err, docs) => {
    res.status(500).json({
        docs
    });
  })
});
router.patch(/\/user\/\w{1,}/g, (req, res) => {
  url = req.url;
  var params = req.body;
  var idexp = /\w{20,}/g
  var ids = url.match(idexp);
  var id = ids[0];
  //Collection of data

  var keys = Object.keys(params);
  var updatekeys = ["username", "name", "password"];
  var newkeys = [];
  var values = [];
  //seguridad
  for (var i  = 0; i < updatekeys.length; i++) {
    var index = keys.indexOf(updatekeys[i]);
    if (index != -1) {
        newkeys.push(keys[index]);
        values.push(params[keys[index]]);
    }
  }
  var objupdate = {}
  for (var i  = 0; i < newkeys.length; i++) {
    if (newkeys[i] == "password") {
      objupdate[newkeys[i]] = sha1(values[i]);
    } else {
        objupdate[newkeys[i]] = values[i];
    }

  }
  console.log(objupdate);
  USER.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    var id = docs._id
    res.status(200).json({
      msn: id
    })
  });
});
router.put(/\/user\/\w{1,}/g, (req, res) => {
  url = req.url;
  var params = req.body;
  var idexp = /\w{20,}/g
  var ids = url.match(idexp);
  var id = ids[0];
  var objupdate = {
    username: params.username,
    name: params.name
  }
  USER.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    var id = docs._id
    res.status(200).json({
      msn: id
    })
  });
});
router.get(/\/user\/\w{1,}/g, (req, res) => {
  url = req.url;
  var idexp = /\w{20,}/g
  var ids = url.match(idexp);
  var id = ids[0];
  console.log(ids);
  USER.findOne({_id: id}, (err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    res.status(200).json({
      docs
    })
  });
});
router.get('/user', (req, res) => {
  USER.find({}, (err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    res.status(200).json({
      docs
    });
  });
});

router.post('/user', function(req, res) {
  var params = req.body;
  var username_reg = /^[a-zA-Z0-9]{3,}$/g
  var name_reg = /\w{3,}/g
  var password_reg = /\w{6,}/g
  var result = params.username.match(username_reg)
  if ( result == null) {
    res.status(400).json({
      msns: "El nombre de usuario no es correcto"
    });
    return;
  }
  if (params.name.match(name_reg) == null) {
    res.status(400).json({
      msns: "El nombre  no es correcto"
    });
    return;
  }
  if (params.password.match(password_reg) == null) {
    res.status(400).json({
      msns: "Su password no es correcto requieres minimamente mas de 6 caracteres"
    });
    return;
  }

  var us = {
    username: params.username,
    name: params.name,
    password: sha1(params.password),
    registerDate: new Date()
  }
  var userDB = new USER(us);
  userDB.save().then( (result) => {
    if (result) {
      res.status(201).json({
        msns: "Usuario Creado"
      });
    } else {
      res.status(500).json({
        msns: "Existe un error en la base de datos"
      });
    }
  });
});

module.exports = router;

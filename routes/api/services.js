var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var USER = require("../../database/usersModel");
var ipcalc = require("../../utils/ipcalc");

router.post("/subnet", (req, res) => {
  var data = req.body;
  if (data.ip == null) {
    res.status(300).json({
        msn: "Error en el formato de datos"
    });
    return;
  }
  if (data.mask == null) {
    res.status(300).json({
        msn: "Error en el formato de datos"
    });
    return;
  }
  if (data.host == null) {
    res.status(300).json({
        msn: "Error en el formato de datos"
    });
    return;
  }
  var rex_ip = /\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/g
  if (data.ip.match(rex_ip) == undefined) {
    res.status(300).json({
        msn: "ip mal escrita"
    });
    return;
  }
  var rex_mask = /\d{1,31}/g
  if (data.mask.match(rex_mask) == undefined) {
    res.status(300).json({
        msn: "La mascara debe estar entre 1 y 31"
    });
    return;
  }
  var rex_host = /\d{1,31}/g
  if (data.host.match(rex_host) == undefined) {
    res.status(300).json({
        msn: "Error en el host formato invalido"
    });
    return;
  }
  var mask = parseInt(data.mask, 10);
  var host = parseInt(data.host, 10);
  var hostrestantes = 32 - mask;
  if (host > hostrestantes) {
    res.status(300).json({
        msn: "Los bits host no pueden ser mayores a 32 - " + mask
    });
    return;
  }
  //LO serio
  var red = hostrestantes - host;
  //si tengo una ip
  //192.168.1.5/8
  //ip host = 11
  //ip > 8 ip < 16
  // hostvaraibles =  11 - 8 = 3
  // 3 bits
  // 2 ^ 3 = 8
  //2 ^ 3 -1 = 7
  //bvhost = bits variables de host""
  var bvhost = null;
  if (host < 8 ) {
    bvhost = host - 0 * 8;
  }
  if (host > 8 && host < 2 * 8) {
    bvhost = host - 1 * 8;
  }
  if (host > 16 && host < 3 * 8) {
    bvhost = host - 2 * 8;
  }
  if (host > 24 && host < 3*8) {
    bvhost = host - 2 * 8;
  }
  var redsalto = Math.pow(2, bvhost);
  var redanterior = redsalto - 1;
  var result = new ipcalc(data.ip, mask);
  /*for (var i = 0; i < 10 ; i ++) {

  }*/
  res.status(300).json(result);
});


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

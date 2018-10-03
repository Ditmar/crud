
var ipcalc = function (ip, mask) {
  newmask = convertMask(masl);
  newip = converIpBinary(ip);
  result = converIp(newip, newmask);
  return result;
}

function convertMask (mask) {
  cad = ""
  for (var i = 0; i < 32; i ++) {
    if (i < mask) {
      if (i % 8 == 0) {
        cad = "." + cad;
      }
      cad = "1" + cad;
    } else {
      if (i % 8 == 0) {
        cad = "." + cad;
      }
      cad = "0" + cad;
    }
  }
  return cad.split("").reverse().toString().replace(/,/g,"").replace(/./,"");
}
function converIpBinary (ip) {
  var ipsplit = ip.split(".");
  var ipresult = ""
  for (var i = 0; i < ipsplit.length; i++) {
    var binary = parseInt(ipsplit[i], 10).toString(2);
    if (binary.length < 8) {
      var aux = "";
      for (var j = 0; j < (8 - binary.length) ; j++) {
        aux += "0"
      }
      binary = aux + binary;
    }
    ipresult += binary + ".";
  }
  return ipresult.substring(0, ipresult.length - 1);
}
function converIp (ip, mask) {

  var newip = [];
  var ipsplit = ip.split(".");
  var maskscplit = mask.split(".");
  for (var i = 0; i < ipsplit.length; i ++) {
    auxip = "";
    for (var j = 0; j < ipsplit[i].length; j++) {
      auxip += ipsplit[i][j] & maskscplit[i][j];
    }
    newip.push(auxip);
  }
  var result = newip.toString().replace(/,/g,".");
  var hack = result.split(".");
  var decimalip = parseInt(hack[0],2) + "." + parseInt(hack[1],2) + "." + parseInt(hack[2],2) + "." + parseInt(hack[3],2);

  return {ipdec: decimalip, ipbin: result,ipmask: mask}
}
module.exports = ipcalc;

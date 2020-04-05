var checksum = require("./checksum");

module.exports = {
  getRequest: (req, res) => {
    res.render("paytm/index");
  },
  request: (req, res) => {
    var paramlist = req.body;
    var paramarray = new Array();
    for (name in paramlist) {
      if (name == "PAYTM_MERCHANT_KEY") {
        var PAYTM_MERCHANT_KEY = paramlist[name];
      } else {
        paramarray[name] = paramlist[name];
      }
    }
    paramarray["CALLBACK_URL"] = "https://fast-bayou-86347.herokuapp.com/api/paytm/response";
    checksum.genchecksum(paramarray, PAYTM_MERCHANT_KEY, (err, hash) => {
      if (err) throw err;
      res.render("paytm/request", { paramarray,hash });
    });
  },
  response: (req, res) => {
     console.log(req.body);
     res.render("paytm/response");
    
    if (req.body.RESPCODE === "01") {
      res.render("paytm/response", {
        status: true,
        result: req.body
      });
    } else {
      res.render("paytm/response", {
        status: false,
        result: req.body
      });
    }
  }
};

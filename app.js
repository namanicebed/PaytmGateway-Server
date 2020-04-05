const express = require("express");
const bodyParser = require("body-parser");
const engines = require("consolidate");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  "/api",
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  require("./route-groups")
);

app.get("/", (req, res) => {
  res.send({
    message: "Reno server is up and running"
  });
});

// MULTER
const multer = require("multer");
const storage = multer.diskStorage({
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });
//GET Route
app.get("/api/v1", (req, res) => {
  res.send("cloudinary server is up and running");
});

// POST ROUTE
app.post(
  "/api/v1/upload",
  upload.single("file-input-info"),
  (req, res, next) => {
    console.log("Files", req.file);
    console.log("Body", req.body.restaurantName);

    // SEND FILE TO CLOUDINARY
    cloudinary.config({
      cloud_name: "reno-bill-database-service",
      api_key: "227256513334459",
      api_secret: "-uSAlLNiH_HCvilfT39bXvgOHI8"
    });

    const path = req.file.path;
    const uniqueFilename = new Date().toISOString();

    cloudinary.uploader.upload(
      path,
      {
        public_id: `${req.body.restaurantName}/${uniqueFilename}`,
        tags: `blog`
      }, // directory and tags are optional
      function(err, image) {
        if (err) return res.send(err);
        console.log("file uploaded to Cloudinary");

        var fs = require("fs");
        fs.unlinkSync(path);

        res.json(image);
      }
    );
  }
);

module.exports = app;

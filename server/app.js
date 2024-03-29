const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const SSE = require("express-sse");
const sse = new SSE([]);

const indexRouter = require("./routes/index");
const uploadRouter = require("./routes/upload.js");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cleanTemp = require("./jobs/cleanTemp");

const cron = require("node-cron");
const app = express();

cron.schedule("* * * * *", () => {
  cleanTemp();
});

app.use(fileUpload({ limits: { fileSize: 150 * 1024 * 1024 } }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.get("/events", sse.init);
app.use("/upload", uploadRouter(sse));

module.exports = app;


const express = require('express');
const DBconnect = require('./db');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./Routes/auth"));
app.use("/api/products", require("./Routes/products"));

app.get("/", async (req, res) => {
    res.send("Home Page");
}).listen(5000, () => {
    console.log("listening on port http://localhost:5000");
});

DBconnect();
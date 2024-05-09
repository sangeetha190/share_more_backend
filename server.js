const express = require("express");
const app = express();
// Access the env variable
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnect");
const cors = require("cors");
const apiRouter = require("./routes");

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (req, res) => res.send("API is running  🌎 !!!"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("APP is Connected on PORT ", PORT));

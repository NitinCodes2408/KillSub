const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const PORT = 5000;
app.listen(PORT, () => console.log(`Subkill Backend running on port ${PORT}`));

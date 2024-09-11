const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const route = require("./routes");

const cors = require("cors");

// Use CORS middleware
app.use(cors());

// For Paticular origin use //

// app.use(cors({
//     origin: 'http://localhost:3000', // Allow only to react this origin
//   }));

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

const urlencoded = bodyParser.urlencoded({ extended: true });

const port = 5000;

app.use("/public", express.static(__dirname + "/public"));

app.get("/login", urlencoded, route);

app.post("/login", urlencoded, route);

app.get("/registration", urlencoded, route);

app.post("/registration", urlencoded, route);

app.get("/forgot_pwd", urlencoded, route);

app.post("/forgot_pwd", urlencoded, route);

app.post("/create_task", urlencoded, route);

app.get("/recent_task", urlencoded, route);

app.get("/new_task", urlencoded, route);

app.get("/all_task", urlencoded, route);

app.get("/task_action", urlencoded, route);

app.post("/update_task", urlencoded, route);

app.post("/profileUpdate", urlencoded, route);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

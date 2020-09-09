require("dotenv").config();
const express = require("express");
const http = require("http");
const logger = require("morgan");
const errorHandler = require("errorhandler");
const cors = require("cors");
const passport = require("passport");

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let { PORT, ENVIROMENT } = process.env;
PORT = PORT || 3000;
ENVIROMENT = ENVIROMENT || "development";

// morgan logger setup
if (ENVIROMENT === "development") {
	app.use(logger("dev"));
	app.use(errorHandler());
} else {
	app.use(logger("short"));
}


app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const boardRoutes = require("./routes/board");
require("./configs/passport-jwt")(passport);
app
	.use("/api", authRoutes)
	.use("/api/user", userRoutes)
	.use("/api/board", boardRoutes);


// bad request - catches all non existing routes
app.use((req, res) => {
	res.status(404).json({
		error: `Bad request: ${req.method} ${req.originalUrl}`,
	});
});

server.listen(PORT, () => {
	console.log(`server running on PORT: [${PORT}] in [${ENVIROMENT}]`);
});

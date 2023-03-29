require('dotenv').config()

const express = require('express')
const cors = require('cors');

const session = require('express-session');
const bodyParser = require('body-parser');

const port = process.env.PORT
const app = express()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
	origin:["http://localhost:3000"],
	methods: ["GET", "POST"],
	credentials: true,
}))


app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));

const authRoute = require("./routes/auth");
app.use("/auth", authRoute);


app.get('/', (request, response) => {
	request.session.destroy()
	// if (request.session.loggedin) {
	// 	response.send('1')
	// } else {
	// 	response.send('2')
	// }
	response.end();
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
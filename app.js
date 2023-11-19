const sqlite3 = require('sqlite3').verbose();
const http = require('http'),
	path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser');

const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
	db.run("INSERT INTO user VALUES ('adminUser', 'adminPassword', 'Administrator')");
});


app.get('/', function (req, res) {
    res.sendFile('index.html');
});


app.post('/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;

	let query = `SELECT title FROM user WHERE username ='${username}' AND  password='${password} '`;
	console.log({username, password, query});
	

	db.get(query, (err, row) => {

		if (err) {
			console.log(err);
			res.redirect("/index.html#error");
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send(`
				<div>
					<h3> Hello ${row.username} </h3>	
					<h4>SECRETS</h4>
					<p>
						The scary thing is that is supposed to secret is here.  Don't tell anyone. Only authorized users allowed.
					</p>
					<a href="/index.html">Go back to login</a>
				</div>
			`);
		}
	}
	);
}
);

		


app.listen(3000);
console.log('Server is running on port 3000');
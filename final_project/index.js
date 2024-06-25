const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    const { username, password } = req.body;

    if (username, password) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            username // You can include additional data in the token payload if needed
        }, 'your_jwt_secret', { expiresIn: '1h' });

        // Store access token and username in session
        req.session.username = username;

        return res.status(200).json({ message: "The review has been deleted!"});
    } else {
        return res.status(401).json({ message: "Invalid login credentials" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

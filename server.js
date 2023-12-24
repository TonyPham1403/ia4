require('dotenv').config();

// Import các module cần thiết và khai báo app
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const fs = require('fs');
const https = require('https');
const http = require('http');
const { create } = require('express-handlebars');

// Import module passport và cấu hình
const passportConfig = require('./modules/passport');

// Khai báo app
const app = express();

// Cấu hình session
const SECRET_KEY = process.env.SECRET_KEY;
app.use(
	session({
		secret: SECRET_KEY,
		resave: true,
		saveUninitialized: true,
	})
);

// Khai báo template engine (Handlebars)
const hbs = create({
	extname: '.hbs',
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault: true,
	},
	helpers: require('./helper'),
});

// Cấu hình app
app.use('/imgs', express.static('imgs'));
app.use('/views', express.static('views'));
app.use(cookieParser(SECRET_KEY));
app.use(flash());

// Cấu hình passport
passportConfig(app);

// Cấu hình template engine
app.engine('hbs', hbs.engine);
app.set('views', './views');
app.set('view engine', 'hbs');

// Middleware để kiểm tra đăng nhập, chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
const requireLogin = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return res.redirect('/auth/login');
	}
	next();
};

// Sử dụng middleware requireLogin cho các route cần yêu cầu đăng nhập
app.use('/admin', requireLogin);
app.use('/subscriber', requireLogin);

// Các route
const userRoutes = require('./routers/customer.route');
const adminRoutes = require('./routers/admin.route');
const subscriberRoutes = require('./routers/subscriber.route');
const homeRoutes = require('./routers/home.route');

app.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		// Nếu đã đăng nhập, chuyển hướng đến trang chính của ứng dụng
		return res.redirect('../views/home'); // Thay '/home' bằng đường dẫn tương ứng
	}
	// Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
	res.redirect('/auth/login');
});

app.get('/home', (req, res) => {
	// Hiển thị trang chính của ứng dụng
	res.render('home');
});

app.use('/auth', userRoutes);
app.use('/admin', adminRoutes);
app.use('/subscriber', subscriberRoutes);

// Các route và middleware khác...

// Cấu hình server và lắng nghe các port
const httpPort = process.env.HTTP_PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 3001;
const localhost = process.env.HOST;

const privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(httpPort, () => {
	console.log(`HTTP Server is running on: http://${localhost}:${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
	console.log(`HTTPS Server is running on: http://${localhost}:${httpsPort}`);
});

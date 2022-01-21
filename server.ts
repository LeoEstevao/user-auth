import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import router from './routes';

const app = express();

app.use(session({
secret: "mySecret",
// resave: true,
// saveUninitialized: false,
    cookie: {
        maxAge: 30000
    }
}))
app.use(express.json());

app.use('/', router);



app.listen(3333,() => {
    console.log('Server running')
});
import express from 'express';

import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import User from './database/models/User';


const app = express();
app.use(express.json());

app.get('/', (req, res) => {

    res.send('Home page');
})
app.post('/register', (req, res) => {

    createConnection().then( async connection => {

        const username = req.body.username;
        const password = req.body.password;
        const userRepository = getRepository(User);

        await userRepository.save({
            username,
            password,
            isOnline: false,
            createdAt: new Date()
        }).then( result => {
            res.json(result)
        })

        connection.close()
    })

})


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    createConnection().then( async connection => {
        const userRepository = getRepository(User);

        await userRepository.findOne({
            username,
            password
        }).then( result => {
            if(!result)
            return res.json({
                message: "User not found!"
            })
            return res.json(result)
            // return res.redirect();
        })
        connection.close();
    })
})

app.listen(3333,() => {
    console.log('Server running')
});
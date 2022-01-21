import { Router } from 'express';

import { createConnection, getRepository } from 'typeorm';
import User from './database/models/User';
const router = Router();

router.get('/', (req, res) => {
    res.send('Home page');
})

router.post('/register', (req, res) => {

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


router.post('/login', (req, res) => {
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
            return res.json({message: "user found", result })
            // return res.redirect();
        })
        connection.close();
    })
})

export default router;
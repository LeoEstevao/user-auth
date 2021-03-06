import { Router } from 'express';

import { createConnection, getRepository } from 'typeorm';
import User from './database/models/User';
const router = Router();

import bcrypt from 'bcryptjs';

// Creating new sessions variables without typescript types Error warning
declare module "express-session" {
    interface Session {
        user: string;
    }
}

router.get('/', (req, res) => {
    if(req.session.user)
        return res.send('Welcome ' + req.session.user)
    return res.send('Home page');
})

router.post('/register', (req, res) => {
    createConnection().then( async connection => {
        const salt = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(req.body.password, salt);
        const username = req.body.username;
        const userRepository = getRepository(User);

        await userRepository.save({
            username,
            password: hash,
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
        }).then( result => {
            if(!result)
            return res.json({
                message: "User not found!"
            })

            const userIsAuth = bcrypt.compareSync(password, result.password)
            
            if(!userIsAuth)
                return res.status(403).json({message:'Wrong Password'});
            
            req.session.user = result.username
            return res.json({message: "User authorized!", result})
        })

        connection.close();
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy( err => {
        console.log('User logout!')
    })
    return res.redirect('/')
})

export default router;
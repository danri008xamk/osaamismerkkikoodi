import express from 'express';
import { PrismaClient } from '@prisma/client';
import {Virhe} from '../errors/virheenkasittelija';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/login/oppilas", async(req: express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        const oppilas = await prisma.oppilas.findFirst({
            where: {
                nimi: req.body.nimi,
                kirjautumisavain: req.body.kirjautumisavain
            }
        })
        if(oppilas) {
            res.json(oppilas)
        } else {
            next(new Virhe(401))
        }
    } catch (e : any) {
        next(new Virhe())
    }
})

apiAuthRouter.post("/login/ope", async(req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        const kayttaja = await prisma.opettaja.findFirst({
            where: {
                etunimi : req.body.etunimi,
                sukunimi : req.body.sukunimi
            }
        })

        if(kayttaja) {
            let hash = crypto.createHash("SHA256").update(req.body.salasana).digest("hex");
            
            if(hash === kayttaja.salasana) {
                let token = jwt.sign({id : kayttaja.id, nimi : `${kayttaja.etunimi}_${kayttaja.sukunimi}`}, String(process.env.ACCESS_TOKEN_KEY));

                res.json({token : token})
            } else {
                next(new Virhe(401))
            }

        } else {
            next(new Virhe(401))
        }

    } catch (e : any) {
        next(new Virhe());
    }
})

export default apiAuthRouter;
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virheenkasittelija';
import cors from 'cors';

const prisma : PrismaClient = new PrismaClient();

const apiOppilaatRouter : express.Router = express.Router();

cors({origin : "http://localhost:3000"});

apiOppilaatRouter.use(express.json());

apiOppilaatRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    
    if(req.body.nimi && req.body.luokka && req.body.kirjautumisavain) {
        try {
            await prisma.oppilas.create({data : {
                nimi : req.body.nimi,
                luokka : req.body.luokka,
                kirjautumisavain : req.body.kirjautumisavain,
                opettajaId : Number(res.locals.kayttaja.id)
            }})

            res.json(await prisma.oppilas.findMany({where: {opettajaId : Number(res.locals.kayttaja.id)}}));
        } catch(e : any) {
            next(new Virhe())
        }
    } else {
        next(new Virhe(400))
    }

})

apiOppilaatRouter.get("/" , async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        res.json(await prisma.oppilas.findMany({where: {opettajaId : Number(res.locals.kayttaja.id)}}));
    } catch(e : any) {
        next(new Virhe())
    }
})

export default apiOppilaatRouter;
import express from 'express';
import { osaamismerkki, PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virheenkasittelija';

const prisma : PrismaClient = new PrismaClient();

const apiMerkitRouter : express.Router = express.Router();

interface OsaamismerkkiNimi {
    osaamismerkkiNimi : string
}

apiMerkitRouter.use(express.json());

apiMerkitRouter.get("/:oppilasId", async (req : express.Request, res : express.Response, next : express.NextFunction) => { 
    try {
        //Haetaan kaikki mahdolliset merkit
        let osaamismerkit : osaamismerkki[] = await prisma.osaamismerkki.findMany();
        //Haetaan ne merkit, jotka oppilaalla on.
        let oppilaanMerkkienNimet : any = await prisma.oppilasosaamismerkki.findMany({where: {
                                                                                        oppilasId : Number(req.params.oppilasId)
                                                                                        }
                                                                                    })
        //Otetaan oppilaan saamista merkeistä ylös pelkät nimet                                                                            
        oppilaanMerkkienNimet = oppilaanMerkkienNimet.map((a : any) => a.osaamismerkkiNimi)
        
        //Luodaan taulukot merkkien jaottelua varten
        let oppilaanMerkit : osaamismerkki[] = [];
        let puuttuvatMerkit : osaamismerkki[] = [];
    
        osaamismerkit.map((merkki) => {
            if(oppilaanMerkkienNimet.includes(merkki.nimi)) {
                oppilaanMerkit.push(merkki)
            } else {
                puuttuvatMerkit.push(merkki)
            }
        })

        //Lähetetään taulukot responsena.
        res.json({saadut: oppilaanMerkit, puuttuvat: puuttuvatMerkit})
    } catch {
        next(new Virhe());
    }
})

apiMerkitRouter.post("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
       await prisma.oppilasosaamismerkki.create({
                                            data: {
                                                oppilasId : Number(req.params.id),
                                                osaamismerkkiNimi : req.body.osaamismerkki
                                            }
        })

        res.json({});
    } catch (e : any) {
        next(new Virhe());
    }
})

apiMerkitRouter.delete("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
       await prisma.oppilasosaamismerkki.deleteMany({
                                            where: {
                                                oppilasId : Number(req.params.id),
                                                osaamismerkkiNimi : req.body.osaamismerkki
                                            }
        })

        res.json({});
    } catch (e : any) {
        next(new Virhe());
    }
})

apiMerkitRouter.get("/" , async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        res.json(await prisma.osaamismerkki.findMany());
    } catch(e : any) {
        next(new Virhe());
    }
})


export default apiMerkitRouter;
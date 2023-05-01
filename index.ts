import express from 'express';
import dotenv from 'dotenv';
import virheenkasittelija from './errors/virheenkasittelija'
import path from 'path';
import apiOppilaatRouter from './routes/apiOppilaat';
import apiMerkitRouter from './routes/apiMerkit';
import jwt from 'jsonwebtoken';
import apiAuthRouter from './routes/apiAuth';

dotenv.config();

const app : express.Application = express();

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        let token : string = req.headers.authorization!.split(" ")[1];

        res.locals.kayttaja = jwt.verify(token, String(process.env.ACCESS_TOKEN_KEY))
        next();
    } catch (e : any) {
        res.status(401).json({})
    }
}

app.use(express.static(path.resolve(__dirname, "public")))

app.use("/api/oppilaat", checkToken, apiOppilaatRouter);

app.use("/api/merkit", apiMerkitRouter);

app.use("/api/auth", apiAuthRouter)

app.use(virheenkasittelija);

app.listen(String(process.env.PORT), () => {
    console.log(`Palvelin käynnistyi porttiin ${process.env.PORT}`)
})
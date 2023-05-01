import { Alert, Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import { Oppilas, Merkki } from '../App';

interface Props {
    setAuki : Dispatch<SetStateAction<boolean>>
    auki : boolean
    oppilas : Oppilas
    merkit : Merkki[]
}

export interface OppilaanMerkit {
    saadut : Merkki[],
    puuttuvat : Merkki[]
}

const OppilaanTiedot : React.FC<Props> = (props : Props) : React.ReactElement => {
    const [merkit, setMerkit] = useState<OppilaanMerkit>({
        saadut: [],
        puuttuvat : []
    })

    const [virhe, setVirhe] = useState<string>("");

    const haeOppilaanMerkit = async () => {
        try {
        const yhteys = await fetch(`/api/merkit/${props.oppilas.id}`, {method: "GET"});
            if(yhteys.status === 200) {
                setMerkit(await yhteys.json())
            } else {
                setVirhe("Tapahtui virhe - tietoja ei voitu hakea.")
            }
        } catch (e) {
            setVirhe("Palvelimeen ei saatu yhteyttä.")
        }
        
    }

    const muokkaaMerkkeja = async (merkki : Merkki, metodi : string) => {
        const yhteys = await fetch(`/api/merkit/${props.oppilas.id}`, {
            method: metodi, 
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({osaamismerkki: merkki.nimi})
        } )
        haeOppilaanMerkit();
    }
    

    useEffect(() => {
      haeOppilaanMerkit();
    }, [props.oppilas])
    
    

    return <Dialog open={props.auki} onClose={() => props.setAuki(false)} maxWidth="lg" fullWidth>
        {(Boolean(virhe))
        ? <Alert>{virhe}</Alert>
        : ""}
        <DialogTitle>{props.oppilas.nimi}, {props.oppilas.luokka}</DialogTitle>
        <DialogContent>
            <Typography>Saadut merkit:</Typography>
            {(merkit.saadut.length > 0)
            ? <Stack direction="row">
                {merkit.saadut.map((merkki, idx) => {
                    return <Stack key={idx}>
                        <img src={`http://localhost:3110/images/${merkki.kuva}`} />
                        <Button color="error" onClick={() => muokkaaMerkkeja(merkki, "DELETE")}>Poista</Button>
                    </Stack>
                })}
            </Stack>
            :""}
            <Typography>Puuttuvat merkit:</Typography>
            {(merkit.puuttuvat.length > 0)
            ? <Stack direction="row">
                {merkit.puuttuvat.map((merkki, idx) => {
                    return <Stack key={idx}>
                        <img key={idx} src={`http://localhost:3110/images/${merkki.kuva}`} />
                        <Button onClick={() => muokkaaMerkkeja(merkki, "POST")}>Lisää</Button>
                        </Stack>
                })}
            </Stack>
            :""}
        </DialogContent>
    </Dialog>
}

export default OppilaanTiedot;

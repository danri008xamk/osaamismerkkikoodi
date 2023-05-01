import React, {Dispatch, SetStateAction, useRef, useState } from 'react';
import { Oppilas } from '../App';
import { Alert, Button, Dialog, DialogTitle, Paper, TextField, Typography } from '@mui/material';

interface Props {
    setAuki : Dispatch<SetStateAction<boolean>>
    auki : boolean
    setOppilaat : Dispatch<SetStateAction<Oppilas[]>>
    token : string
}

const OppilaanLisays : React.FC<Props> = (props : Props) : React.ReactElement => {

    const lomakeRef : any = useRef<HTMLFormElement>();
    const [virhe, setVirhe] = useState<string>("");

    const suljeIkkuna = () => {
        setVirhe("");
        props.setAuki(false);
    }

    const lisaaOppilas = async (e : React.FormEvent) => {

        e.preventDefault();
        let oppilas : Oppilas = {
            id : 0,
            opettajaId : 1,
            nimi : lomakeRef.current.nimi.value,
            luokka : lomakeRef.current.luokka.value,
            kirjautumisavain : lomakeRef.current.kirjautumisavain.value
        }

        let asetukset = {
            method : "POST",
            headers: {
                        'Authorization' : `Bearer ${props.token}`,
                        'Content-Type' : 'application/json'
                    },
            body: JSON.stringify(oppilas)
        }

        try {
            const yhteys = await fetch("/api/oppilaat/", asetukset);

            if(yhteys.status === 200) {
                props.setOppilaat(await yhteys.json());
                suljeIkkuna();
            } else {
                setVirhe("Oppilaan lisääminen epäonnistui.")
            }
        } catch(e : any) {
            setVirhe("Palvelimeen ei saatu yhteyttä.")
        }
    }

    return <Dialog open={props.auki} onClose={suljeIkkuna}>
        <DialogTitle>Lisää uusi oppilas:</DialogTitle>
        {(Boolean(virhe))
        ? <Alert severity='error'>{virhe}</Alert>
        :""}
        <Paper component="form" ref={lomakeRef} sx={{margin:1, padding:2}} onSubmit={lisaaOppilas}>
            <TextField name="nimi" label="Oppilaan nimi" fullWidth/>
            <TextField name="luokka" label="Oppilaan luokka" fullWidth/>
            <TextField 
                name="kirjautumisavain" 
                label="Kirjautumistunnus" 
                helperText="Oppilas kirjautuu omalla nimellään ja antamallasi kirjautumistunnuksella." 
                fullWidth
            />
            <Button type="submit" variant="contained">Lisää oppilas</Button>
            <Button variant="outlined" color="error" onClick={suljeIkkuna}>Peruuta</Button>
        </Paper>
    </Dialog>
}

export default OppilaanLisays;
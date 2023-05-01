import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import { Alert, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Oppilas } from '../App';

interface Props {
    setToken : Dispatch<SetStateAction<string>>
    setKirjautunutOppilas : Dispatch<SetStateAction<Oppilas>>
}

const Kirjautuminen : React.FC<Props> = (props : Props) : React.ReactElement => {

    const opeRef : any = useRef<HTMLFormElement>();
    const oppilasRef : any= useRef<HTMLFormElement>();
    const [virhe, setVirhe] = useState<string>("");

    const navigate : NavigateFunction = useNavigate();

    const opeKirjautuu = async (e : React.FormEvent) => {
        e.preventDefault();
        
        if(opeRef.current?.nimi.value.split(" ").length === 2) {
            let asetukset = {
                method : "POST",
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    etunimi: opeRef.current.nimi.value.split(" ")[0],
                    sukunimi: opeRef.current.nimi.value.split(" ")[1],
                    salasana: opeRef.current.salasana.value
                })
            }
    
            const yhteys = await fetch("/api/auth/login/ope", asetukset);
    
            if(yhteys.status === 200) {
                let {token} = await yhteys.json();
                props.setToken(token);
                localStorage.setItem("token", token);
                navigate("/")
            } else {
                setVirhe("Väärä käyttäjätunnus tai salasana.")
            }
        }
    }

    const oppilaskirjautuu = async (e : React.FormEvent) => {
        e.preventDefault();

        let asetukset = {
            method : "POST",
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                nimi: oppilasRef.current.nimi.value,
                kirjautumisavain: oppilasRef.current.salasana.value
            })
        }

        const yhteys = await fetch("/api/auth/login/oppilas", asetukset);

        if(yhteys.status === 200) {
            props.setKirjautunutOppilas(await yhteys.json());
            navigate("/oppilas")
        } else {
            setVirhe("Väärä nimi tai kirjautumistunnus.")
        }
    }

    return <Container>
        <Stack direction="row" spacing={1} sx={{marginTop: 2}}>
            {(Boolean(virhe))
            ? <Alert severity='error'>{virhe}</Alert>
            : ""}
            <Paper 
                component="form" 
                ref={opeRef} 
                onSubmit={opeKirjautuu}
                elevation={3}
                sx={{padding: 2}}
            >
                <Typography variant="h5" sx={{marginBottom: 2}}>Kirjaudu opettajana</Typography>
                <TextField name="nimi" label="Nimi" fullWidth sx={{marginBottom: 1}}/>
                <TextField name="salasana" label="Salasana" type="password" fullWidth sx={{marginBottom: 1}}/>
                <Button variant="contained" type="submit" fullWidth sx={{marginBottom: 1}}>Kirjaudu sisään</Button>
            </Paper>
            <Paper 
                component="form" 
                ref={oppilasRef} 
                onSubmit={oppilaskirjautuu}
                elevation={3}
                sx={{padding: 2}}
            >
                <Typography variant="h5" sx={{marginBottom: 2}}>Kirjaudu oppilaana</Typography>
                <TextField name="nimi" label="Nimi" fullWidth sx={{marginBottom: 1}} />
                <TextField name="salasana" label="Kirjautumistunnus" helperText="Saat kirjautumistunnuksen opettajaltasi." fullWidth sx={{marginBottom: 1}} />
                <Button variant="contained" type="submit" fullWidth sx={{marginBottom: 1}}>Kirjaudu sisään</Button>
            </Paper>
        </Stack>

    </Container>
}

export default Kirjautuminen;
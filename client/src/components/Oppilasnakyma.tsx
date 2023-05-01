import React, {useState, useEffect, Dispatch, SetStateAction} from 'react'
import { Merkki, Oppilas } from '../App'
import { OppilaanMerkit } from './OppilaanTiedot'
import {Dialog, Alert, DialogTitle, DialogContent, Typography, Stack, Button} from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';


interface Props {
    oppilas : Oppilas
    setOppilas : Dispatch<SetStateAction<Oppilas>>
}

const Oppilasnakyma : React.FC<Props> = (props : Props) : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const [merkit, setMerkit] = useState<OppilaanMerkit>({
        saadut: [],
        puuttuvat: []
    })
    const [virhe, setVirhe] = useState<string>("")

    const [auki, setAuki] = useState<boolean>(true)

    const suljeNakyma = () => {
        props.setOppilas({
            id : 0,
            nimi : "",
            luokka : "",
            kirjautumisavain : "",
            opettajaId : 0
        })
        navigate("/login")
    }

    const haeMerkit = async () => {
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

    useEffect(() => {
        haeMerkit();
      }, [props.oppilas])
        

    return (
        <Dialog open={auki} onClose={suljeNakyma} maxWidth="lg" fullWidth>
        {(Boolean(virhe))
        ? <Alert>{virhe}</Alert>
        : ""}
        <DialogTitle>Hei, {props.oppilas.nimi.split(" ")[0]}!</DialogTitle>
        <DialogContent>
            <Typography>Olet saanut nämä merkit:</Typography>
            {(merkit.saadut.length > 0)
            ? <Stack direction="row">
                {merkit.saadut.map((merkki, idx) => {
                    return <Stack key={idx}>
                        <img src={`/images/${merkki.kuva}`} />
                    </Stack>
                })}
            </Stack>
            :""}
            <Typography>Sinulta puuttuvat vielä:</Typography>
            {(merkit.puuttuvat.length > 0)
            ? <Stack direction="row">
                {merkit.puuttuvat.map((merkki, idx) => {
                    return <Stack key={idx}>
                        <img key={idx} src={`/images/${merkki.kuva}`} />                     
                        </Stack>
                })}
            </Stack>
            :""}
        </DialogContent>
    </Dialog>
    )
}

export default Oppilasnakyma;
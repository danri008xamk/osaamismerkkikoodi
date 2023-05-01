import { Button, Container, Stack, Typography } from '@mui/material';
import React, {useEffect, useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import Kirjautuminen from './components/Kirjautuminen';
import Oppilaslista from './components/Oppilaslista';
import Oppilasnakyma from './components/Oppilasnakyma';

export interface Oppilas {
  id : number
  nimi : string
  luokka : string
  kirjautumisavain : string
  opettajaId : number
}

export interface Merkki {
  nimi : string
  kuva : string
}

export interface Opettaja {
  id : number
  etunimi : string
  sukunimi : string
}

const App : React.FC = () : React.ReactElement => {
  const [merkit, setMerkit] = useState<Merkki[]>([]);

  const [opettaja, setOpettaja] = useState<Opettaja>({
    id: 0,
    etunimi: "",
    sukunimi: ""
  })

  const [kirjautunutOppilas, setKirjautunutOppilas] = useState<Oppilas>({
    id : 0,
    nimi : "",
    luokka : "",
    kirjautumisavain : "",
    opettajaId : 0
  })

  const [token, setToken] = useState<string>(String(localStorage.getItem("token")));


  const haeMerkit = async () => {
    try {
      const yhteys = await fetch("/api/merkit", {method: "GET"});
      if(yhteys.status === 200) {
        setMerkit(await yhteys.json())
      } 
    } catch (e : any) {

    }
  }

  useEffect(() => {
    haeMerkit();
  }, [])

  return (
    <Container maxWidth="md">
      {(merkit.length > 0)
      ? <Stack direction="row" spacing={1}>
          {merkit.map((merkki, idx) => {
          return <img key={idx} src={`/images/${merkki.kuva}`} />
        })}
        </Stack>
      : ""}
      <Routes>
        <Route path="/" element={<Oppilaslista token={token} setToken={setToken} merkit={merkit} />} />
        <Route path="/login" element={<Kirjautuminen setToken={setToken} setKirjautunutOppilas={setKirjautunutOppilas}/>} />
        <Route path="/oppilas" element={<Oppilasnakyma oppilas={kirjautunutOppilas} setOppilas={setKirjautunutOppilas}/>} />
      </Routes>
    </Container>
  );
}

export default App;

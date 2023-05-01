import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Merkki, Oppilas } from '../App';
import { Button, Container, Table, TableHead, TableRow, TableCell, TableBody, Alert } from '@mui/material';
import OppilaanLisays from './OppilaanLisays';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import OppilaanTiedot from './OppilaanTiedot';

interface Props {
    token : string
    setToken: Dispatch<SetStateAction<string>>
    merkit : Merkki[]
}

const Oppilaslista : React.FC<Props> = (props : Props) : React.ReactElement => {

  const [oppilaat, setOppilaat] = useState<Oppilas[]>([]);
  const [virhe, setVirhe] = useState<string>("");
  const [lisaysAuki, setLisaysAuki] = useState<boolean>(false);

  const [oppilasAuki, setOppilasAuki] = useState<boolean>(false);
  const [oppilas, setOppilas] = useState<Oppilas>({
    nimi: "",
    luokka: "",
    kirjautumisavain: "",
    id: 0,
    opettajaId : 0
  });

  const navigate : NavigateFunction = useNavigate(); 

  const avaaOppilas = (oppilas : Oppilas) => {
    setOppilas(oppilas);
    setOppilasAuki(true);
  }

  const haeOppilaat = async () => {
    try {
      const yhteys = await fetch("/api/oppilaat", {
                                                    method: "GET", 
                                                    headers : {'Authorization' : `Bearer ${props.token}`}
                                                  })

      if(yhteys.status === 200) {
        setOppilaat(await yhteys.json());
        setVirhe("");
      } else {
        switch(yhteys.status) {
          case 401 : navigate("/login"); break;
          default : setVirhe("Palvelimella tapahtui odottamaton virhe."); break;
        }
      }
    } catch (e : any) {
      setVirhe("Palvelimeen ei saatu yhteyttä.")
    }
  }

  const kirjauduUlos = () => {
    props.setToken("");
    localStorage.setItem("token", "");
    navigate("/login");
  }

  useEffect(() => {
    haeOppilaat();
  }, [])

    return(
      <Container>
        {(Boolean(virhe))
        ? <Alert severity='error'>{virhe}</Alert>
        : <Table sx={{width:"70%"}}>
        <TableHead>
          <TableRow>
            <TableCell>Nimi</TableCell>
            <TableCell>Luokka</TableCell>
            <TableCell>Kirjautumistunnus</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {oppilaat.map((oppilas,idx) => {
            return <TableRow hover key={idx} onClick={() => avaaOppilas(oppilas)}>
              <TableCell>{oppilas.nimi}</TableCell>
              <TableCell>{oppilas.luokka}</TableCell>
              <TableCell>{oppilas.kirjautumisavain}</TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>}
      <Button 
        variant="contained" 
        onClick={() => setLisaysAuki(true)} 
        size="large"
        fullWidth
        sx={{marginTop: 5, marginBottom: 5}}
      >
        Lisää uusi oppilas
      </Button>
      <OppilaanLisays 
        auki={lisaysAuki} 
        setAuki={setLisaysAuki} 
        setOppilaat={setOppilaat} 
        token={props.token} 
      />
      <OppilaanTiedot 
        auki={oppilasAuki} 
        setAuki={setOppilasAuki} 
        oppilas={oppilas} 
        merkit={props.merkit}
      />
      <Button color="error" variant="contained" fullWidth onClick={kirjauduUlos}>Kirjaudu ulos</Button>   
      </Container>
       
    )
}

export default Oppilaslista;
import './App.css';
import { useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Card from "react-bootstrap/Card";
import { Grid } from '@mui/material';

function App() {
  const [data, setData] = useState({ breed: null, sub_breed: null });
  const [names, setNames] = useState([]);


  const [child, setChild] = useState([]);
  const [subNames, setSubNames] = useState([]);

  const [fullFilter, setFilter] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    names && setNames([]);
    subNames && setSubNames([]);

    const getData = async () => {
      const response = await fetch('https://dog.ceo/api/breeds/list/all')
      const data = await response.json();
      //raza padre
      const breed = Object.keys(data.message);
      setData({ breed: breed, sub_breed: Object.values(data.message) });
    }
    getData();
  }, [])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setNames(typeof value === 'string' ? value.split(',') : value);

    const lastObj = value[value.length - 1]; //string
    const indexBreed = data.breed.indexOf(lastObj); //index 
    const objSub = data.sub_breed[indexBreed]; //obj:[]
    setChild(objSub);
  };

  const handleChange2 = (event) => {
    const {
      target: { value },
    } = event;
    setSubNames(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    if (names.length) {
      setFilter(names.concat(subNames));
    }
  }, [names, subNames])

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const styles = {
    BorderClass: {
      width: 160,
      height: 160,
      borderWidth: 1,
      borderColor: '#F44336',
    }
  };

  const handleDelete = (e) => {
    console.log("todelete", e.target?.parentNode?.id);

    const toDelete = e.target?.parentNode?.id;

    setFilter(fullFilter.filter(f => f !== toDelete));
  };


  useEffect(() => {
    let arrPhotos = photos || [];
    fullFilter.length > 0 && fullFilter.map(breed => {
      fetch(`https://dog.ceo/api/breed/${breed}/images/random`).then(res => {
        return res.json();
      }).then(data => arrPhotos.push(data.message)).catch(err => console.log("err", err));
    });
    setPhotos(arrPhotos);
  }, [fullFilter])


  return (
    <div className="App">
      <div>
        <Container>
          <Card className="text-center">
            <Card.Header>
              <InputLabel id="demo-multiple-checkbox-label">Razas filtradas</InputLabel>
              {
                fullFilter.length ?
                  fullFilter.map(filter => <Chip className={`${filter}`} label={filter} variant="outlined" id={filter} key={filter} title={filter} onDelete={handleDelete} />)
                  :
                  null
              }
            </Card.Header>
            <Card.Body>
              <Grid container spacing={2}>

                <div className="row">

                  <div className="col-6">
                    <FormControl style={{ width: '100%' }}>
                      <Grid item xs={6}>

                        <InputLabel id="input-raza-id">Seleccione Raza</InputLabel>
                        <Select
                          multiple
                          labelId="input-raza-id"
                          id="multiple-checkbox"
                          value={names}
                          onChange={handleChange}
                          MenuProps={MenuProps}
                          renderValue={(selected) => selected.join(', ')}
                          style={{ width: '300px', marginTop: '5px', marginBottom: '5px' }}
                          label="Seleccione Raza"
                        >

                          {data.breed && data.breed.map((raza) => (
                            <MenuItem key={raza} value={raza}>
                              <Checkbox checked={names.indexOf(raza) > -1} />
                              <ListItemText primary={raza} />
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </FormControl>
                  </div>


                  <div className="col-6">
                    <FormControl style={{ width: '100%' }}>
                      <Grid item xs={6}>
                        {
                          child.length ?
                            <>
                              <InputLabel id="input-subraza-id">Seleccione Sub-raza</InputLabel>
                              <Select
                                multiple
                                id="sub-multiple-checkbox"
                                labelId="input-subraza-id"
                                label="Seleccione Sub-raza"
                                value={subNames}
                                onChange={handleChange2}
                                MenuProps={MenuProps}
                                renderValue={(selected) => selected.join(', ')}
                                style={{ width: '300px', marginTop: '5px', marginBottom: '5px' }}
                              >

                                {child && child.map((sub) => (
                                  <MenuItem key={sub} value={sub}>
                                    <Checkbox checked={subNames.indexOf(sub) > -1} />
                                    <ListItemText primary={sub} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                            :
                            null
                        }
                      </Grid>
                    </FormControl>
                  </div>

                </div>


              </Grid>

            </Card.Body>
            <Card.Footer className="text-muted">
              <InputLabel id="demo-multiple-checkbox-label">Imagenes de perros filtradas</InputLabel>
              {photos.length > 0 ?
                photos.map(p => <img src={`${p}`} alt={p} style={styles.BorderClass} />)
                : null}
            </Card.Footer>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default App;

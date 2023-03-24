import { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { debounce } from '@mui/material/utils';

import './App.css'; 

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

if (!String.prototype.trim) {
  (function() {
    // Вырезаем BOM и неразрывный пробел
    String.prototype.trim = function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  })();
}

const isEmpty = (str) => {
  if (str.trim() == '') 
    return true;
    
  return false;
}

function App() {

  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [wasSelect, setWasSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFilms, setLoadingFilms] = useState(false);
  const [selectedActors, setSelectedActors] = useState([]);
  const [commonFilms, setCommonFilms] = useState([]);

  const addActorToSelect = () => {
    const arr = []
    selectedActors.forEach(actor => {
      arr.push(actor.link);
    });
    if (value !== null && !arr.includes(value.link)) {
      setSelectedActors([...selectedActors, value]);
      setValue(null);
      setTimeout(()=>{console.log([...selectedActors, value]);},1);
    }
  };

  const removeActorFromSelected = (removeActor) => {
    const arr = [];
    console.log(removeActor);
    selectedActors.forEach(actor => {
      if (actor != removeActor) 
        arr.push(actor);
      setSelectedActors([...arr]);
    });
    console.log(arr);
  };

  const getActors = async (request, callback) => {
    if(!isEmpty(request.input) && !wasSelect) {
      setLoading(true);
      await fetch("http://127.0.0.1:5000/find_actor/" + request.input.split(' ').join('%20'))
              .then( res => res.json() )
              .then( res => {
                setLoading(false);
                setTimeout(() => {
                  callback(res.message);
                },1);
              });
    }
  }

  const getCommonFilms = async (request, callback) => {
    if(selectedActors.length > 1) {
      setLoadingFilms(true);
      await fetch("http://127.0.0.1:5000/get_common_films/" + request.join('%'))
              .then( res => res.json() )
              .then( res => {
                setLoadingFilms(false);
                setTimeout(() => {
                  callback(res.message);
                },1);
              });
    }
  }

  const Fetch = useMemo(
    () =>
      debounce((request, callback, func) => {
        func(request, callback);
      }, 450),
    [],
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    Fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    }, getActors);

    return () => {
      active = false;
    };
  }, [value, inputValue, Fetch]);

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <main>
      <div className="App">
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "5em"
        }}>
          <h1>Movie Match</h1>
        </div>
        <div>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            noValidate
            style={{
              paddingTop: "0",
              paddingBottom: "0"
            }}  
            autoComplete="off"
            className="input-box"
          >
            <Autocomplete
              sx={{ width: 300 }}  
              getOptionLabel={(option) => 
                option.name
              }
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={value}
              noOptionsText="Актер не найден"
              onChange={(event, newValue) => {
                setWasSelect(true);
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setWasSelect(false);
                setInputValue(newInputValue);
              }}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Поиск актера..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => {
                return (
                  <li {...props}>
                    <Grid container alignItems="center">
                      <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                        <Stack direction="row" spacing={2}>
                          <Avatar alt="Leo" src={
                            option.img
                            } />
                          <div 
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}  
                          >{option.name}</div>
                        </Stack>
                      </Grid>
                    </Grid>
                  </li>
                );
              }}
            />
            <Fab aria-label="add" size="large" id='search-button' onClick={addActorToSelect}>
              <AddIcon />
            </Fab>
          </Box>
        </div>
        <div>
          <ul className='actors-list'>
            {
              selectedActors.map((actor) => (
                <li key={selectedActors.indexOf(actor)}>
                    <span>
                      <Avatar alt="Leo" 
                        className='actors-list-img'
                        src={
                          actor.img
                        } 
                      />
                      <a href={actor.link} target="_blank">
                        {actor.name}
                      </a>
                    </span>
                    <Fab onClick={(event) => {removeActorFromSelected(actor)}} aria-label="add" size="small" style={{background: "#494949", color: "#fff", boxShadow: "none"}}>
                      <DoDisturbOnIcon fontSize='large' />
                    </Fab>
                  </li>
              ))
            }
          </ul>
        </div>
        
        <div style={{
          width: "372px",
          marginTop: "10px"
        }}>
          <Button 
            variant="contained" 
            id='common-films-button'
            onClick={
              (event) => {
                const arr = [];
                selectedActors.forEach(actor => {
                  arr.push(actor.link.split('/')[4])
                  console.log(actor.link.split('/')[4])
                });
                getCommonFilms( arr, (response) => {
                  setCommonFilms(response);
                });
              }
            }
          >
            Общие фильмы
          </Button>
        </div>
        <ul className='common-film-list'>
          {loadingFilms ? <CircularProgress color="inherit" size={20} style={{margin: "0 auto"}}/> : null}
          {
            commonFilms.map((film) => (
              <a href={film.link} target="_blank">
                <li>
                  <Avatar 
                    alt="Remy Sharp" 
                    src={film.img} 
                    variant='rounded' 
                    className='film-list-img'
                    sx={{ width: 45, height: 60 }}
                  />
                  <span>
                    <p>{film.name}</p>
                    <p>{film.year}</p>
                  </span>
                </li>
              </a>
            ))
          }
        </ul>
      </div>
    </main>
  </ThemeProvider>
  )
}


export default App
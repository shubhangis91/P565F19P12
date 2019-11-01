import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { userInfo } from 'os';
import Form from "react-bootstrap/Form"
import axios from "axios"
import clsx from 'clsx';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
 
  textField: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: 300,
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  menu: {
    width: 200,
  },
}));

export default function generalDetails() {
  const classes = useStyles();
  const [value, setValue] = React.useState('female');

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    
    <form className={classes.container} noValidate autoComplete="off">
      <Grid >
      <Grid item>
      <TextField
        id="standard-name"
        label="First Name"
        className={classes.textField}
        value={user.firstName}
        onChange={handleChange('firstName')}
        margin="normal"
      />
      <TextField
        id="outlined-name"
        label="Last Name"
        className={classes.textField}
        value={user.lasttName}
        onChange={handleChange('lastName')}
        margin="normal"
      />
      </Grid>
      <TextField
        id="date"
        label="dob"
        type="date"
        defaultValue="2000-01-01"
        onChange={handleChange('dob')}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      </Grid>
      <Grid >
      <Grid item>
      <TextField
        id="standard-name"
        label="Primary Contact"
        className={classes.textField}
        value={user.primaryContact}
        onChange={handleChange('primaryContact')}
        margin="normal"
   
      />
      <TextField
        id="outlined-name"
        label="Secondary Contact"
        className={classes.textField}
        value={user.secondaryContact}
        onChange={handleChange('secondaryContact')}
        margin="normal"
      />
      </Grid>
      <Grid item>
      <FormControl component="fieldset" className={classes.formControl} style={{marginTop:"2%",marginLeft:"3.5%"}}>
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup aria-label="gender" name="gender" value={user.gender} onChange={handleChange('gender')}>
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
      </Grid>
      <Grid>
        <Button variant="green" onClick={handleSubmit} style={{marginLeft:"100%"}}>
         Sumbit
        </Button>
        </Grid>
      </Grid>
    
    </form>

  );
}

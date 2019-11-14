import React, { useState , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { userInfo } from 'os';
import Form from "react-bootstrap/Form"
import axios from "axios"
import clsx from 'clsx';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from "react-bootstrap/Button"
import { useCookies } from 'react-cookie';


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
  
  export default function ProfileDetails(props) {
    const classes = useStyles();
    const [cookies, setCookie] = useCookies(['userId']);
    const [job, setJob] = React.useState({
      jobName: '',
      companyName: '',//I dont have the company id!!!! Talk to shubh
      jobDomain: '',
      companyIndustry: '',//Shdnt this be fixed to the company too
      jobFunction: '',//What does this mean
      jobDescription: '',
      city:'',
      state:'',
      country:'',
      jobType:'',
      skills:'',
      skillLevel:'',
      userId:1,
    });

const handleChange = (name) => event => {
  setJob({ ...job, [name]: event.target.value });
  console.log(job)
};
const handleSubmit = () => {
  axios
    .post('/',{job})
    .then(res => {
      console.log(res) 
      console.log(res.data)
  })
}
      return(
        <form className={classes.container} noValidate autoComplete="off">
        <Grid >
        <Grid item>
        <TextField
          id="standard-name"
          label="Job Position Name"
          className={classes.textField}
          //value={user.firstName}
          onChange={handleChange('jobName')}
          margin="normal"
        />
        <TextField
          id="outlined-name"
          label="Company Name"
          className={classes.textField}
          //value={user.lastName}
          onChange={handleChange('companyName')}
          margin="normal"
        />
        </Grid>
        </Grid>
        <Grid >
        <Grid item>
        <TextField
          id="standard-name"
          label="Description of the Job"
          className={classes.textField}
          //value={user.firstName}
          onChange={handleChange('jobDescription')}
          margin="normal"
        />
        <TextField
          id="outlined-name"
          label="Type of the Job"
          className={classes.textField}
          //value={user.lastName}
          onChange={handleChange('jobType')}
          margin="normal"
        />
        </Grid>
        </Grid>
        <Grid >
        <Grid item>
        <TextField
          id="standard-name"
          label="Job Domain"
          className={classes.textField}
          //value={user.primaryContact}
          onChange={handleChange('jobDomain')}
          margin="normal"
     
        />
        <TextField
          id="outlined-name"
          label="Company Industry"
          className={classes.textField}
          //value={user.secondaryContact}
          onChange={handleChange('companyIndustry')}
          margin="normal"
        />
        </Grid>
        </Grid>

        <Grid >
        <Grid item>
        <TextField
          id="standard-name"
          label="City"
          className={classes.textField}
          //value={user.firstName}
          onChange={handleChange('city')}
          margin="normal"
        />
        <TextField
          id="outlined-name"
          label="State"
          className={classes.textField}
          //value={user.lastName}
          onChange={handleChange('state')}
          margin="normal"
        />
        <TextField
          id="outlined-name"
          label="Country"
          className={classes.textField}
          //value={user.lastName}
          onChange={handleChange('country')}
          margin="normal"
        />
        </Grid>
        </Grid>

        <Grid>
          <Button variant="green" 
          onClick={handleSubmit} 
          style={{marginLeft:"90%"}}>
           Sumbit
          </Button>
          </Grid>
      
      </form>
      )
  }
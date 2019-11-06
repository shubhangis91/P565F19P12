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
import PersonalData from "./PersonalData"
import { useCookies } from 'react-cookie';
import NewEducationPostComponent from './NewEducationPostComponent';
import EducationPostComponent from './EducationPostComponent';
import NewWorkPostComponent from './NewWorkPostComponent';
import WorkPostComponent from './WorkPostComponent';

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
  const [expanded, setExpanded] = React.useState(false);
  const [cookies, setCookie] = useCookies(['userEmail']);


  const handleExpand = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(user)
    axios
        .post("/register", {user})
        .then(res => {
            console.log(res) 
            console.log(res.data)
        })
        loadValues()

}

const [user, setValues] = React.useState({
  email: cookies['userEmail'],
  firstName: '',
  lastName: '',
  dob: '',
  secondaryContact: '',
  primaryContact: '',
  gender:'',
  userId:1,
});
const [education,setEducation]=useState([])
const [workExp,setWork]=useState([])




const handleChange = (name) => event => {
  setValues({ ...user, [name]: event.target.value });
  console.log(user)
};
const loadValues = () => {
  console.log(user)
  var strUser = "/userDetails";
  var strEdu = "/showEducation";
  var strWork = "showWorkExperience";
  var str2 = "?userId="
  var str3 = user.userId;
  var getUserdetails = strUser.concat(str2, str3);
  var getEducation = strEdu.concat(str2,str3);
  var getWork = strWork.concat(str2,str3);
  axios
        .get(getUserdetails)
        .then(res => {
          console.log(res.data)
          setValues(res.data);
          console.log(user)
        })
  // axios
  //       .get(getEducation)
  //       .then(res => {
  //         console.log(res.data.workExperiences)
  //         setEducation(res.data.workExperiences)
  //         console.log(education)
  //       }) 
  axios
        .get(getWork)
        .then(res => {
          //console.log(res.data.workExperiences)
          setWork(res.data.workExperiences)
          //console.log(workExp)
        })
        
 };
useEffect(() => {loadValues()},[])
const [newEducationComponent, setNewEducationComponent] = React.useState(false)

const handleAddEducation = (event) => {
  setNewEducationComponent(!newEducationComponent)
};

const [newWorkComponent, setNewWorkComponent] = React.useState(false)

const handleAddWork = (event) => {
  setNewWorkComponent(!newWorkComponent)
};


  return (
    <div className={classes.root}>
      <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleExpand('panel1')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>General details</Typography>
          <Typography className={classes.secondaryHeading}>Tell us who you are!</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
          
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
              value={user.lastName}
              onChange={handleChange('lastName')}
              margin="normal"
            />
            </Grid>
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
            <TextField
              id="date"
              label="dob"
              type="date"
              defaultValue={user.dob}
              className={classes.textField}
              onChange={handleChange('dob')}
              InputLabelProps={{
                shrink: true,
              }}
            />
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
              <Button variant="green" onClick={handleSubmit} style={{marginLeft:"90%"}}>
               Sumbit
              </Button>
              </Grid>
            </Grid>
          
          </form>
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleExpand('panel2')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Education Details</Typography>
              
          <Typography className={classes.secondaryHeading}>
              Tell us about your degrees, diplomas, qualificaitons!
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
          {education.map((edu,i) => <EducationPostComponent 
                        key={i}
                        userId= {edu.userId}
                        eduLevel = {edu.eduLevel}
                        institute = {edu.institute}
                        startDate = {edu.startDate}
                        endDate = {edu.endDate}
                        percentage = {edu.percentage}
                        

    
                    />)}
          {!newEducationComponent&&<Button variant = "green" type="button" style={{marginTop:"5%"}} onClick={handleAddEducation}>Add education</Button>}
          {newEducationComponent&&<Button variant = "green" type="button" style={{marginTop:"5%"}} onClick={handleAddEducation}>Undo    </Button>}
          <p>

          </p>
            {newEducationComponent&&<NewEducationPostComponent loadValues={loadValues}/>}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleExpand('panel3')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>Work Experience</Typography>
          <Typography className={classes.secondaryHeading}>
            Tell us about your work experience, it'll give you an edge!
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <Typography>
          {workExp.map((work,i) => <WorkPostComponent 
                        key={i}
                        userId= {work.userId}
                        company = {work.company}
                        startDate = {work.startDate}
                        endDate = {work.endDate}
                        description = {work.description}
                        designation = {work.designation}
                        location = {work.location}
                        loadValues={loadValues}
                    />)}
          {!newWorkComponent&&<Button variant = "green" type="button" style={{marginTop:"5%"}} onClick={handleAddWork}>Add Work Experience</Button>}
          {newWorkComponent&&<Button variant = "green" type="button" style={{marginTop:"5%"}} onClick={handleAddWork}>Undo    </Button>}
          <p>
          </p>
            {newWorkComponent&&<NewWorkPostComponent loadValues={loadValues}/>}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'panel4'} onChange={handleExpand('panel4')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>Personal data</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
           <PersonalData/>
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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

const useStyles = makeStyles(theme=>({
    textField: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 300,
      },
  }));
  
export default function JobPostComponent(props) {
    const [education, setEducation] = React.useState({
        userId: 1,
        eduLevel : '',
        institute : '',
        startDate : '',
        endDate : '',
        percentage : '',
      })
      const handleChange = name => event => {
        setEducation({ ...education, [name]: event.target.value });
        console.log(education)
      };
      const handleSubmit = (event) => {
        event.preventDefault();
        console.log(education)
        axios
            .post("/setEducation", {education})
            .then(res => {
                console.log(res) 
                console.log(res.data)
                props.loadValues()
            })
    
    }
    const classes = useStyles();
    return(
        <Typography>
            <form className={classes.container} noValidate autoComplete="off">
                <Grid>
                    <Grid item>
                        <TextField
                        id="education-level"
                        label="Education Level"
                        className={classes.textField}
                        //value={user.firstName}
                        onChange={handleChange('eduLevel')}
                        margin="normal"
                        />
                        <TextField
                        id="instistute-name"
                        label="Institute-name"
                        className={classes.textField}
                        //value={user.firstName}
                        onChange={handleChange('institute')}
                        margin="normal"
                        />
                    </Grid>
                    <Grid item/>
                        <TextField
                            id="date"
                            label="Starting Date"
                            type="date"
                            //defaultValue="2017-05-24"
                            className={classes.textField}
                            onChange={handleChange('startDate')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                        <TextField
                            id="date"
                            label="Ending Date"
                            type="date"
                            //defaultValue="2017-05-24"
                            className={classes.textField}
                            onChange={handleChange('endDate')}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    <Grid/>
                    <Grid item>
                    <TextField
                        id="Gpa"
                        label="Grade or GPA"
                        className={classes.textField}
                        //value={user.firstName}
                        //onChange={handleChange('user','firstName')}
                        margin="normal"
                        onChange={handleChange('percentage')}
                        />
                    </Grid>
                    <Grid>
                        <Button variant="green" onClick={handleSubmit} style={{marginLeft:"90%"}}>
                        Sumbit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Typography>
    );
}
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import axios from 'axios'
const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    },
}));

export default function PersonalDetails() {
    
    const classes = useStyles();
    const [state, setState] = React.useState({
        checkedA: true,
      });
      useEffect(() => {
        setState(state);
      }, [state]);
      const handleChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
        
        event.preventDefault();
        const user = {
            mfaStatus:state.checkedA,
        };
        console.log(user)
        axios
            .post("/verify", {user})
            .then(res => {
                console.log(res) 
                console.log(res.data)
            })

      };
    return ( 
        <div>
            <FormGroup row>
                <FormControlLabel
                    control={
                    <Switch checked={state.checkedA} onChange={handleChange('checkedA')} value="checkedA" />
                    }
                    label="Enable Login OTP?"
                />
            </FormGroup>
        </div>
     );
}

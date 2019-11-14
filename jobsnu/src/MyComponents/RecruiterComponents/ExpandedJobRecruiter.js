import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import axios from "axios"
import { useCookies } from 'react-cookie';
import OverflowScrolling from 'react-overflow-scrolling';
import UserListComponent from './UserListComponent.js'
const useStyles = makeStyles({
    card: {
        display:'flex',
        marginBottom:'5%',
        marginRight:'5%',
        background:'#F4F4F4',
        borderRadius:'4%'
    },
    media: {
        height: '15%',
        width: '15%',
      }

  });
  
export default function ExpandedJobRecruiter(props) {
  const [cookies, setCookie] = useCookies(['userId']);
  const [users,setUsers] = useState([]);
  const classes = useStyles();
  const getUserApplications = () => {
    axios
    .get("/")
    .then
    .then(res => {
        console.log(res) 
        console.log(res.data)
        setUsers(res.data)
        })
  };
    return(
        <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          component="img"
          alt="Company logo {props.companyName}"
          image="https://5qevh96ime-flywheel.netdna-ssl.com/wp-content/uploads/2018/12/Walmart-Logo.jpg"
          title="{props.companyName}"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
             {props.jobName}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
             {props.description}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
             {props.domain}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
             {props.function}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
             {props.industry}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
             {props.jobType}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
             {props.skillLevel}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
             {props.jobType}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
             <LocationOnIcon/> {props.state} {props.country}
          </Typography>
          <OverflowScrolling className='overflow-scrolling'style={{  height: "12vh"}}>
          {users.map((user,i) => <UserListComponent/>)}
            <UserListComponent/>
            <UserListComponent/>
            <UserListComponent/>
          </OverflowScrolling>
        </CardContent>
      </CardActionArea>
      <CardActions>
      </CardActions>
    </Card>
    )}
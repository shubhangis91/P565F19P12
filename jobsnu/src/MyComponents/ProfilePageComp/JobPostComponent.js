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
  
export default function JobPostComponent(props) {
  const [cookies, setCookie] = useCookies(['userId']);
  const [moreDetials,setMoreDetails] = useState(false);
  const classes = useStyles();
  const applyJob = (event) => {
    const user = {
      userId:parseInt(cookies['userId']),
      jobId:props.jobId,
  }
  console.log(user)
    axios
        .post('/applyJob',{user})
        .then(res => {
          console.log(res) 
          console.log(res.data)

          })
    }
  const learnMore = () => {
    props.handleExpand(props)
  };
    return(
        <Card className={classes.card}>
      <CardActionArea onClick={learnMore}>
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
          <Typography variant="body2" color="textSecondary" component="p">
             <LocationOnIcon/> {props.state} {props.country}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {props.apply&&<Button onClick={applyJob} size="small" color="primary">
          Apply
        </Button>}
        <Button onClick={learnMore} size="small" color="primary">
          Details
        </Button>
      </CardActions>
    </Card>
    );
}
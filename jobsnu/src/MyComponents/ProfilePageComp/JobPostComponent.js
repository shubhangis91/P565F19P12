import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    card: {
        display:'flex',
    },
    media: {
        height: '15%',
        width: '15%',
      }

  });
  
export default function JobPostComponent(props) {
    const classes = useStyles();
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
            jobName {props.jobName}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            joblocation:  {props.state} {props.country}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
    );
}
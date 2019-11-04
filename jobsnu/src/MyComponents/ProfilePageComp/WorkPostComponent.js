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
import LocationCityIcon from '@material-ui/icons/LocationCity';

const useStyles = makeStyles({
    card: {
        display:'flex',
        marginTop:'5%',
    },
    media: {
        height: '15%',
        width: '15%',
      }

  });
  
export default function WorkPostComponent(props) {
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
             {props.designation}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
             <LocationCityIcon/> {props.company},{props.location}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Typography gutterBottom >
                {props.startDate.substring(0,7)} - {props.endDate.substring(0,7)}
        </Typography>
        <Typography gutterBottom>
            {props.percentage}
        </Typography>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
    );
}
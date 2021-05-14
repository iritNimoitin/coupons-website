import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CouponModel from '../../../Models/CouponModel';
import LogoImage from "../../../Assests/Images/Coupons_logo.png";
import { Chip } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import globals from '../../../Services/Globals';
import axios from 'axios';
import notify from '../../../Services/Notification';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 250,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }),
);

interface CouponCardProps {
	coupon: CouponModel;
}

export default function CouponCard(props: CouponCardProps) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [image, setImage] = React.useState();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    getImageFromServer();
  }, []);

  async function getImageFromServer() {
    try{
        const headers = {
            'id': props.coupon.id,
            'category': props.coupon.category
        }
        //get products from the server:
        const response = await axios.get(globals.urls.images, {headers});
        console.log(props.coupon.id);
        //update local state:
        setImage(response.data[0]);
    }catch (err) {
        // notify.error(err);
    }
  }

  return (
    <Card className={classes.root} square={false} variant="outlined">
      <CardHeader
        avatar={
            <Chip variant="outlined" color="primary" label={props.coupon.category} />
        }
        title={props.coupon.title}
        // subheader= {"$" + props.coupon.price.toString()}
      />
      <NavLink to= {"/coupons/" + props.coupon.category + "/" + props.coupon.id}> 
        <CardMedia
          id={props.coupon.id.toString()}
          className={classes.media}
          title={props.coupon.title}
          image={image}
        />
      </NavLink>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
            Price: ${props.coupon.price}<br/>
            Amount: {props.coupon.amount}<br/>
            {/* Company: {props.coupon.company.name}<br/> */}
            Start date: {props.coupon.startDate}<br/>
            End Date: {props.coupon.endDate}<br/>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon color= "secondary" />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon color= "primary" />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Description:</Typography>
          <Typography paragraph>
            {props.coupon.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

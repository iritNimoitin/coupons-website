import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CouponModel from '../../../Models/CouponModel';
import LogoImage from "../../../Assests/Images/Coupons_logo.png";
import { Chip } from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';
import globals from '../../../Services/Globals';
import Button from '@material-ui/core/Button';
import store from '../../../Redux/Stores';
import CompanyModel from '../../../Models/CompanyModel';
import companyService from '../../../Services/CompanyService';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon } from "react-share";
import { Unsubscribe } from 'redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 250,
    },
    media: {
      height: 0,
      paddingTop: '56.25%',
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
  const [image, setImage] = React.useState<string>(LogoImage);
  const [clientId, setClientId] = React.useState<number>(null);
  let unsubscribeMe: Unsubscribe;

  const history = useHistory();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (store.getState().AuthState.clientType === "Company") {
      setClientId((store.getState().AuthState.user as CompanyModel).id);
    }
    if (props.coupon.imagesNames) {
      setImage(globals.urls.images + props.coupon.category + "/" + props.coupon.id + "/" + props.coupon.imagesNames[0]);
    }
    unsubscribeMe = store.subscribe(() => {
      if (store.getState().AuthState.clientType === "Company") {
        setClientId((store.getState().AuthState.user as CompanyModel).id);
      }
    });
    return () => unsubscribeMe();
  }, []);

  const handleDelete = () => {
    companyService.deleteCoupon(props.coupon);
  }

  const handleUpdate = () => {
    let path = `/company/update/${props.coupon.category}/${props.coupon.id}`;
    history.push(path);
  }

  return (
    <Card className={classes.root} square={false} variant="outlined">
      <CardHeader
        avatar={
          <Chip variant="outlined" color="primary" label={props.coupon.category} />
        }
        title={props.coupon.title}
        subheader={props.coupon.company.name}
      />
      <NavLink to={"/coupons/" + props.coupon.category + "/" + props.coupon.id}>
        <CardMedia
          id={props.coupon.id.toString()}
          className={classes.media}
          title={props.coupon.title}
          image={image}
        />
      </NavLink>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Price: ${props.coupon.price}<br />
            Amount: {props.coupon.amount}<br />
            Start date: {props.coupon.startDate}<br />
            End Date: {props.coupon.endDate}<br />
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        &nbsp;
        <FacebookShareButton
          url={"https://github.com/iritNimoitin"}
          quote={props.coupon.title}
          hashtag={"#LuckyCoupons"}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
          &nbsp;
          <WhatsappShareButton
          url={"https://github.com/iritNimoitin"}
          title={props.coupon.title}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        &nbsp;&nbsp;
        {clientId === props.coupon.company.id &&
          <>
            <Button variant="contained" color="primary" size="small" onClick={handleUpdate}>
              Update
            </Button>
            &nbsp;
            <Button variant="contained" color="secondary" size="small" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
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

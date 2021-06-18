import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Header from '../Header/Header';
import BackToTop from '../../LayoutArea/BackToTop/BackToTop';
import Routing from '../../Routing/Routing';
import { BrowserRouter, NavLink } from 'react-router-dom';
import Footer from '../../LayoutArea/Footer/Footer';
import Menu from "../Menu/Menu";
import Logo from '../Logo/Logo';
import SearchAppBar from '../SearchAppBar/SearchAppBar';
import PersonIcon from '@material-ui/icons/Person';
import { createStyles, fade, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { GridSpacing } from '@material-ui/core/Grid';
import { LeakRemoveTwoTone } from '@material-ui/icons';
import { Unsubscribe } from 'redux';
import store from '../../../Redux/Stores';
import CustomerModel from '../../../Models/CustomerModel';
import CompanyModel from '../../../Models/CompanyModel';
import AdminMenu from '../../AdminArea/AdminMenu/AdminMenu';
import { getNewToken } from '../../../Redux/AuthState';
import "./HideAppBar.css";

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function HideAppBar(props: Props) {

  let unsubscribeMe: Unsubscribe;
  let interval = 0;
  let isLogin = false;
  const checkExpiration = 1000 * 60 * 59 * 10;

  const [user, setUser] = React.useState(null);
  const [clientType, setClientType] = React.useState(null);

  useEffect(() => {
    setUser(store.getState().AuthState.user);
    setClientType(store.getState().AuthState.clientType);
    unsubscribeMe = store.subscribe(() => {
      if (!isLogin && store.getState().AuthState.user) {
        isLogin = true;
        setUser(store.getState().AuthState.user);
        setClientType(store.getState().AuthState.clientType);
        interval = window.setInterval(() => {
          getNewToken(store.getState().AuthState.user, store.getState().AuthState.clientType);
        }, checkExpiration)
      } else if (isLogin && !store.getState().AuthState.user) {
        isLogin = false;
        clearInterval(interval);
        setUser(null);
        setClientType(null);
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribeMe();
    }
  }, [])


  const StyledButton = withStyles({
    root: {
      //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      borderRadius: 30,
      border: 0,
      color: 'white',
      height: 38,
      padding: '0 10px',
      // boxShadow: '0 3px 5px 2px rgba(255, 255, 255, 255)',
    },
    label: {
      textTransform: 'capitalize',
    },
  })(Button);

  return (
    <BrowserRouter>
      <React.Fragment>
        <CssBaseline />
        <HideOnScroll {...props}>
          <AppBar className="appBar">
            <Toolbar>
              <Grid container justify="space-between" direction="row" alignItems="center" spacing={(3 as GridSpacing)}>
                <Grid item>
                  <header>
                    <NavLink to={"/home"}>
                      {props.children}
                    </NavLink>
                  </header>
                </Grid>
                <Grid item>
                  <Menu />
                </Grid>
                <Grid item>
                  <SearchAppBar />
                </Grid>
                <Grid item>
                  {clientType === "Company" ?
                    <NavLink to={"/company/coupons"}>
                      <StyledButton>My Coupons</StyledButton>
                    </NavLink>
                    : clientType === "Customer" ?
                      <NavLink to={"/customer/coupons"}>
                        <StyledButton>My Coupons</StyledButton>
                      </NavLink>
                      : clientType === "Administrator" ?
                        <AdminMenu />
                        : null
                  }
                </Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>
                <Grid item></Grid><Grid item></Grid>

                {user ?
                  <>
                    <Grid item>
                      <span>Hello,&nbsp;{(user as CustomerModel).firstName || (user as CompanyModel).name || "Admin"}</span>
                    </Grid>
                    <Grid item>
                      <NavLink to={"/logout"}>
                        <StyledButton startIcon={<PersonIcon />}>logout</StyledButton>
                      </NavLink>
                    </Grid>
                  </>

                  :

                  <Grid item>
                    <NavLink to={"/login"}>
                      <StyledButton startIcon={<PersonIcon />}>login</StyledButton>
                    </NavLink>
                  |
                  <NavLink to={"/register"}>
                      <StyledButton>register</StyledButton>
                    </NavLink>
                  </Grid>


                }
              </Grid>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar id="back-to-top-anchor" />
        <Container>
          <Box my={2}>
            <main>
              <Routing />
            </main>
          </Box>
        </Container>
        <BackToTop  {...props} />
        {/* <footer>
          <Footer />
        </footer> */}
      </React.Fragment>
    </BrowserRouter>
  );
}
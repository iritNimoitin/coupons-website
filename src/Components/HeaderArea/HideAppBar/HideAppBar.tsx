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
import { Button } from '@material-ui/core';
import { LeakRemoveTwoTone } from '@material-ui/icons';
import { Unsubscribe } from 'redux';
import store from '../../../Redux/Stores';
import CustomerModel from '../../../Models/CustomerModel';
import CompanyModel from '../../../Models/CompanyModel';

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

  //let unsubscriteMe: Unsubscribe;

  const [user, setUser] = React.useState(null);
  const [clientType, setClientType] = React.useState(null);

  useEffect(() => {
    setUser(store.getState().AuthState.user);
    setClientType(store.getState().AuthState.clientType);
    //unsubscriteMe = 
    store.subscribe(() => {
      setUser(store.getState().AuthState.user);
      setClientType(store.getState().AuthState.clientType);
    });
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
          <AppBar>
            <Toolbar>
              <header>
                {props.children}
              </header>
              <NavLink to={"/home"}>
                <Logo />
              </NavLink>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Menu />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <SearchAppBar />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {clientType === "Company" &&
                <NavLink to={"/company/coupons"}>
                  <StyledButton>My Couopns</StyledButton>
                </NavLink>
              }
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {user ?
                <>
                  <span>Hello,</span>&nbsp;
                  <span>{(user as CustomerModel).firstName || (user as CompanyModel).name || "Admin"}</span>
                  <NavLink to={"/logout"}>
                    <StyledButton startIcon={<PersonIcon />}>logout</StyledButton>
                  </NavLink>
                </>
                :
                <>
                  <NavLink to={"/login"}>
                    <StyledButton startIcon={<PersonIcon />}>login</StyledButton>
                  </NavLink>
                  |
                  <NavLink to={"/register"}>
                    <StyledButton>register</StyledButton>
                  </NavLink>
                </>
              }
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
        <footer>
          <Footer />
        </footer>
      </React.Fragment>
    </BrowserRouter>
  );
}
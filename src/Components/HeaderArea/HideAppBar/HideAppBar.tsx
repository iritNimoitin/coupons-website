import React from 'react';
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
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../LayoutArea/Footer/Footer';
import Menu from "../Menu/Menu";
import Logo from '../Logo/Logo';
import SearchAppBar from '../SearchAppBar/SearchAppBar';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';

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
              <Logo/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <SearchAppBar/>
              <Menu/>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar id="back-to-top-anchor" />
        <Container>
          <Box my={2}>
              <main>
                  <Routing/>
              </main>
          </Box>
        </Container>
        <BackToTop  {...props}/>
        <footer>
              <Footer/>
        </footer>
      </React.Fragment>
    </BrowserRouter>
  );
}
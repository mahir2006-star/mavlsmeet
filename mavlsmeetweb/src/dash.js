import React from 'react';
import { makeStyles,alpha } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from "@material-ui/core/Avatar"
import {CircularProgress,IconButton} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import PrimarySearchAppBar from "./Appbardash.js";
import SecondarySearchAppBar from "./secondsearchappbar.js";
import ProfileUi from "./profiler.js";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import CheckStat from './checkstat.js';
import PricingPage from './PricicngPage.js';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
const logout=()=>{
  firebase.auth().signOut();
}
function Dash(){
  const classes = useStyles();
    return (
      <div className="dashboard">
      <Card id="profilecard">
    <SecondarySearchAppBar onClick={logout} />
<center id="profcen">
<CircularProgress />
<ProfileUi />
</center>
      </Card>
      <Card id="actioncard">
      <CheckStat style={{display:"none"}}/>
      <div id="downboard">
    <center>  <CircularProgress /></center>
      </div>
      </Card>
      </div>
    );
}
export default Dash;

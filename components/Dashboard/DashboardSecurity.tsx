import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../App.css";
import { getCustodialChainUrl } from "../redux/slice/DashboardReducer";
import { RootState } from "../redux/Store";

const useStyles = makeStyles((theme) => ({
  rootBox: {
    padding: theme.spacing(8),
  },
  button: {
    width: 300,
    marginTop: 20,
  },
  marginTop2: {
    marginTop: theme.spacing(2),
  },
  marginTop8: {
    marginTop: theme.spacing(8),
  },
  marginTop12: {
    marginTop: theme.spacing(12),
  },
}));

const DashboardSecurity: React.FunctionComponent = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { notifications, deploymentLoading } = useSelector(
    (state: RootState) => state.setup
  );
  const { sideChaninLoading, getCustodialChainUrlData } = useSelector(
    (state: RootState) => state.dashboard
  );

  const getCustodialChainData = () => {
    dispatch(getCustodialChainUrl())
  }
  useEffect(() => {
    getCustodialChainData();
  }, []);


  return (
    <Box className={classes.rootBox}>
      <Typography variant={"subtitle1"}>JWT Signing Keys</Typography>
      {/* <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
      >
        View API Key
      </Button> */}
      <br />
      {/* <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
      >
        Regenerate API Keys
      </Button> */}

      <Typography variant={"subtitle1"} className={classes.marginTop8}>
        Signing Authority
      </Typography>
      <Typography className={classes.marginTop2}>
        Address: {getCustodialChainUrlData.signingAuthorityAddress}
      </Typography>
      <Typography className={classes.marginTop2}>
        Private Key: {getCustodialChainUrlData.signingAuthorityPrivateKey}
      </Typography>
      <Typography className={classes.marginTop2}>
        Mnemonic: {getCustodialChainUrlData.signingAuthorityMnemonic}
      </Typography>
      {/* <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
      >
        View Private Key
      </Button>
      <br />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
      >
        Change Private Key
      </Button> */}

      <Typography variant={"subtitle1"} className={classes.marginTop8}>
        Treasury
      </Typography>
      <Typography className={classes.marginTop2}>
        Address: {getCustodialChainUrlData.treasuryAddress}
      </Typography>
      <Typography className={classes.marginTop2}>
        Private Key: {getCustodialChainUrlData.treasuryPrivateKey}
      </Typography>
      <Typography className={classes.marginTop2}>
        Mnemonic: {getCustodialChainUrlData.treasuryMnemonic}
      </Typography>
      {/* <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
      >
        View Private Key
      </Button>
      <br />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
      >
        Change Private Key
      </Button> */}

      <Typography variant={"subtitle1"} className={classes.marginTop8}>
        User Settings
      </Typography>
      {/* <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
      >
        Delete Account
      </Button> */}
    </Box>
  );
};

export default DashboardSecurity;

import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function LoginComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("userId") ? true : false
  );
  const [isInputEmailError, setIsInputEmailError] = useState(false);
  const [inputEmailError, setInputEmailError] = useState("");
  const [isInputPasswordError, setIsInputPasswordError] = useState(false);
  const [inputPasswordError, setInputPasswordError] = useState("");

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsError(false);
  };

  const handleEmailChange = (event) => {
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!validRegex.test(event.target.value)) {
      setIsInputEmailError(true);
      setInputEmailError("Invalid Email");
    } else {
      setIsInputEmailError(false);
      setInputEmailError("");
    }
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    // let validPassRegex = /(?=.*?[#?!@$%^&*-])/;

    // if (event.target.value.trim().length <= 6) {
    //   setIsInputPasswordError(true);
    //   setInputPasswordError("Invalid Password");
      // } else if (!validPassRegex.test(event.target.value)) {
      // setIsInputPasswordError(true);
      // setInputPasswordError(
      // "Password must contain atleast one special character"
      // );
    // } else {
    //   setIsInputPasswordError(false);
    //   setInputPasswordError("");
    // }
    setPassword(event.target.value.trim());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isInputEmailError) {
      setIsError(true);
      setErrorMessage("Invalid Email or Password");
    } else if (email.trim().length === 0 || password.trim().length === 0) {
      setIsError(true);
      setErrorMessage("Invalid Email or Password");
    } else {
      const data = new FormData(event.currentTarget);

      setIsLoading(true);

      fetch("http://localhost:5000/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.isSucess) {
            setIsLoading(false);
            setIsError(true);
            setErrorMessage(res.err ? res.err : "Internal Server Error");
          } else {
            localStorage.setItem("userId", res.userId);
            setIsLoading(false);
            setIsLoggedIn(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setIsError(true);
          setErrorMessage(err);
        });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={isError}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <div>
          <Alert
            onClose={handleSnackBarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </div>
      </Snackbar>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoFocus
                value={email}
                onChange={handleEmailChange}
                error={isInputEmailError ? true : false}
                helperText={inputEmailError}
                disabled={isLoading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                error={isInputPasswordError ? true : false}
                helperText={inputPasswordError}
                disabled={isLoading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Stack>
  );
}

export default LoginComponent;

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { green, grey, indigo, red } from "@material-ui/core/colors";
import DoneOutlineOutlinedIcon from "@material-ui/icons/DoneOutlineOutlined";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Stack } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const useStyles = (theme) => ({
  container: {
    maxWidth: "1140px",
    margin: "24px auto",
    padding: theme.spacing(2),
  },
  formContainer: {
    padding: theme.spacing(3),
  },
  heading: {
    textAlign: "center",
    color: indigo[500],
    marginBottom: theme.spacing(4),
  },
  secondColumn: {
    margin: theme.spacing(4, 0, 3, 0),
  },
  ListContainer: {
    background: "white",
    padding: theme.spacing(2),
    minHeight: "300px",
    height: "auto",
  },
  emptyMsg: {
    textAlign: "center",
    color: grey[400],
    marginTop: theme.spacing(3),
  },
  ListContainerTitle: {
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: indigo[500],
  },
  remainTaskAvatar: {
    backgroundColor: indigo["A400"],
    color: "white",
  },
  completeTaskAvatar: {
    backgroundColor: green[600],
    color: "white",
  },
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function FormComponent(props) {
  const userId = localStorage.getItem("userId");

  const [inputData, setInputData] = useState("");
  const [remainingTaskList, setRemainingTaskList] = useState([]);
  const [completedTaskList, setCompletedTaskList] = useState([]);
  const [inputError, setInputError] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsError(false);
  };

  const refreshPosts = () => {
    setIsLoading(true);

    fetch(`http://localhost:5000/tasks?userId=${userId}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.isSucess) {
          setIsLoading(false);
          setIsError(true);
          setErrorMessage(res.err ? res.err : "Internal Server Error");
          return;
        }
        const completedTask = res.data.filter(
          (item) => item.isCompleted === true
        );
        const remainingTask = res.data.filter(
          (item) => item.isCompleted === false
        );
        setRemainingTaskList(remainingTask);
        setCompletedTaskList(completedTask);
        setInputData("");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsError(true);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputData.length > 5 && inputData !== "") {
      setIsLoading(true);

      fetch(`http://localhost:5000/tasks/newTask?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: inputData,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.isSucess) {
            setIsLoading(false);
            setIsError(true);
            setErrorMessage(res.err ? res.err : "Internal Server Error");
            return;
          }
          refreshPosts();
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setIsError(true);
        });
    }
  };

  const handleOnChange = ({ target }) => {
    if (target.value.length <= 5) {
      setInputError("Task should have at least 5 characters");
    } else {
      setInputError("");
    }

    setInputData(target.value);
  };

  const handleCheck = (id) => {
    setIsLoading(true);

    fetch(`http://localhost:5000/tasks/completeTask/${id}?userId=${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.isSucess) {
          setIsLoading(false);
          setIsError(true);
          setErrorMessage(res.err ? res.err : "Internal Server Error");
          return;
        }
        refreshPosts();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsError(true);
      });
  };

  const handleDelete = (id) => {
    setIsLoading(true);

    fetch(`http://localhost:5000/tasks/deleteTask/${id}?userId=${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.isSucess) {
          setIsLoading(false);
          setIsError(true);
          setErrorMessage(res.err ? res.err : "Internal Server Error");
          return;
        }
        refreshPosts();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsError(true);
      });
  };

  useEffect(() => {
    setIsLoading(true);

    fetch(`http://localhost:5000/tasks?userId=${userId}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.isSucess) {
          setIsLoading(false);
          setIsError(true);
          setErrorMessage(res.err ? res.err : "Internal Server Error");
        } else {
          const completedTask = res.data.filter(
            (item) => item.isCompleted === true
          );
          const remainingTask = res.data.filter(
            (item) => item.isCompleted === false
          );
          setRemainingTaskList(remainingTask);
          setCompletedTaskList(completedTask);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  const { classes } = props;
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
        <Alert
          onClose={handleSnackBarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Box className={classes.container}>
        <Grid container>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <form onSubmit={handleSubmit} className={classes.formContainer}>
                <Typography variant="h5" className={classes.heading}>
                  {" "}
                  React Todo List App
                </Typography>
                <Grid container justifyContent="center">
                  <Grid item xs={8}>
                    <TextField
                      id="inputTaskField"
                      label="Press Enter To Add A Task"
                      variant="outlined"
                      fullWidth={true}
                      size="small"
                      value={inputData}
                      onChange={handleOnChange}
                      error={inputError ? true : false}
                      helperText={inputError}
                      disabled={isLoading}
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* task grid container */}
          <Grid item xs={12} className={classes.secondColumn}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={6}>
                <List className={classes.ListContainer} dense={true}>
                  <Typography
                    className={classes.ListContainerTitle}
                    variant="h5"
                  >
                    Remaining Tasks
                  </Typography>
                  {/* //mapping remaining list task  */}
                  {remainingTaskList.length > 0 ? (
                    remainingTaskList.map((item, i) => (
                      <ListItem key={i}>
                        <ListItemAvatar>
                          <Avatar className={classes.remainTaskAvatar}>
                            {item.task[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.task}
                          primaryTypographyProps={{
                            style: {
                              wordBreak: "break-word",
                            },
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            style={{ color: green[500] }}
                            onClick={() => handleCheck(item._id)}
                          >
                            <DoneOutlineOutlinedIcon />
                          </IconButton>
                          <IconButton
                            style={{ color: red[600] }}
                            onClick={() => handleDelete(item._id)}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  ) : (
                    <Typography className={classes.emptyMsg}>
                      No Task added yet!...
                    </Typography>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} sm={6} lg={6}>
                <List className={classes.ListContainer} dense={true}>
                  <Typography
                    className={classes.ListContainerTitle}
                    variant="h5"
                  >
                    Completed Tasks
                  </Typography>
                  {/* //mapping completeTaskAvatar list task  */}
                  {completedTaskList.length > 0 ? (
                    completedTaskList.map((item, i) => (
                      <ListItem key={i}>
                        <ListItemAvatar>
                          <Avatar className={classes.completeTaskAvatar}>
                            {item.task[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.task}
                          primaryTypographyProps={{
                            style: {
                              wordBreak: "break-word",
                            },
                          }}
                          secondary={item._id}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography className={classes.emptyMsg}>
                      No Task added yet!...
                    </Typography>
                  )}
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}

export default withStyles(useStyles)(FormComponent);

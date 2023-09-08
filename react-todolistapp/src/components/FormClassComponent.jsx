import React, { Component } from "react";
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
import { useAuth } from "./AuthProvider";

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

class FormClassComponent extends Component {
  auth = useAuth();
  userId = localStorage.getItem("userId");
  constructor() {
    super();
    this.state = {
      inputData: "",
      remainingTaskList: [],
      completedTaskList: [],
      inputError: "",
      isError: false,
      isLoading: false,
    };
  }

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      isError: false,
    });
  };

  hamdleBackdropClose = () => {
    this.setState({
      isLoading: false,
    });
  };

  refreshPosts() {
    fetch(`http://localhost:5000/tasks?userId=${this.userId}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.isSucess) {
          throw new Error();
        }
        const completedTask = res.data.filter(
          (item) => item.isCompleted === true
        );
        const remainingTask = res.data.filter(
          (item) => item.isCompleted === false
        );
        this.setState({
          remainingTaskList: remainingTask,
          completedTaskList: completedTask,
          inputData: "",
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
          isError: true,
        });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (this.state.inputData.length > 5 && this.state.inputData !== "") {
      this.setState({
        isLoading: true,
      });

      fetch(
        `http://localhost:5000/tasks/newTask?userId=${this.userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task: this.state.inputData,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (!res.isSucess) {
            throw new Error();
          }
          this.refreshPosts();
        })
        .catch((err) => {
          console.log("Error", err);
          this.setState({
            isLoading: false,
            isError: true,
          });
        });
    }
  };

  handleOnChange = ({ target }) => {
    target.value.length <= 5
      ? this.setState({
          inputError: "Task should have atleast have 5 character",
        })
      : this.setState({ inputError: "" });

    this.setState({
      inputData: target.value,
    });
  };

  handleCheck = (id) => {
    this.setState({
      isLoading: true,
    });

    fetch(
      `http://localhost:5000/tasks/completeTask/${id}?userId=${this.userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.isSucess) {
          throw new Error();
        }
        this.refreshPosts();
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
          isError: true,
        });
      });
  };

  handleDelete = (id) => {
    this.setState({
      isLoading: true,
    });

    fetch(
      `http://localhost:5000/tasks/deleteTask/${id}?userId=${this.userId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.isSucess) {
          throw new Error();
        }
        this.refreshPosts();
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
          isError: true,
        });
      });
  };

  getCurrentTime = (date) => {
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let amPm = hour >= 12 ? "pm" : "am";

    //formaiitng  date 12:30 pm
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour "0" should be 12
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let currentTime = hour + ":" + minutes + amPm;
    return currentTime;
  };

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    fetch(`http://localhost:5000/tasks?userId==${this.userId}`)
      .then((res) => res.json())
      .then((res) => {
        const completedTask = res.data.filter(
          (item) => item.isCompleted === true
        );
        const remainingTask = res.data.filter(
          (item) => item.isCompleted === false
        );
        this.setState({
          remainingTaskList: remainingTask,
          completedTaskList: completedTask,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,

          isError: true,
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Stack>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          open={this.state.isError}
          autoHideDuration={6000}
          onClose={this.handleSnackBarClose}
        >
          <Alert
            onClose={this.handleSnackBarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            This is an Error message!
          </Alert>
        </Snackbar>
        <Box className={classes.container}>
          <Grid container>
            <Grid item xs={12}>
              <Paper elevation={3}>
                <form
                  onSubmit={this.handleSubmit}
                  className={classes.formContainer}
                >
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
                        value={this.state.inputData}
                        onChange={this.handleOnChange}
                        error={this.state.inputError ? true : false}
                        helperText={this.state.inputError}
                        disabled={this.state.isLoading}
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
                    {this.state.remainingTaskList.length > 0 ? (
                      this.state.remainingTaskList.map((item, i) => (
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
                              onClick={() => this.handleCheck(item._id)}
                            >
                              <DoneOutlineOutlinedIcon />
                            </IconButton>
                            <IconButton
                              style={{ color: red[600] }}
                              onClick={() => this.handleDelete(item._id)}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))
                    ) : (
                      <Typography className={classes.emptyMsg}>
                        No Task added yet !...
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
                    {this.state.completedTaskList.length > 0 ? (
                      this.state.completedTaskList.map((item, i) => (
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
                        No Task added yet !...
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
}

export default withStyles(useStyles)(FormClassComponent);

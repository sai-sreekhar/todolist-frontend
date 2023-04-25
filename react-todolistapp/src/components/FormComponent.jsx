import React, { useState } from "react";
import {
  Box,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(3, 0, 2, 0),
    padding: theme.spacing(2),
  },
  formContainer: {
    padding: theme.spacing(2),
  },
  heading: {
    textAlign: "center",
    color: indigo[500],
    marginBottom: theme.spacing(3),
  },
}));

export default function FormComponent() {
  const classes = useStyles();
  const [inputData, setInputData] = useState("");
  const [inputError, setInputError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const handleOnChange = ({ target }) => {
    target.value.length <= 5
      ? setInputError("Task atleast have 5 character")
      : setInputError("");
    setInputData(target.value);
  };

  return (
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
                  />
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

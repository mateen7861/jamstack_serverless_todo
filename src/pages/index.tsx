import React, { useState } from "react"
import {
  Container,
  TextField,
  List,

  Button,
  Box,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import AddIcon from "@material-ui/icons/Add"
import { gql, useMutation, useQuery } from "@apollo/client"
import Todo from "../components/Todo"

const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    addTodo(title: $title) {
      id
    }
  }
`

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      done
    }
  }
`

const useStyles = makeStyles(theme => ({
  root: {
    width: "90%",
    margin: "20px auto",
    backgroundColor: theme.palette.background.paper,
  },
  page: {
    width: "1024px",
    margin: "50px auto 0px",
    display: "flex",
    flexDirection: "column",
  },
}))

export default function Home() {
  const classes = useStyles()

  const { data, loading, error, refetch } = useQuery(GET_TODOS)
  const [addTodo] = useMutation(ADD_TODO)

  const [todoText, setTodoText] = useState("")

  const addTodoFunc = todo => {
    addTodo({
      variables: { title: todo },
    })
    refetch()
  }

  return (
    <Container className={classes.page}>
      <Box>
        <TextField
          style={{ width: "90%", marginRight: "4px" }}
          id="outlined-basic"
          label="Add Todo"
          variant="outlined"
          onChange={e => setTodoText(e.target.value)}
        />
        <Button
          style={{ width: "5%", height: "56px" }}
          variant="contained"
          color="secondary"
          onClick={() => {
            addTodoFunc(todoText)
          }}
        >
          <AddIcon />
        </Button>
      </Box>
      {loading ? <div>loading...</div> : null}
      {error ? <div>{error.message}</div> : null}
      {!loading && !error && (
        <List className={classes.root}>
          {data.todos.map(todo => (
            <Todo todo={todo} />
          ))}
        </List>
      )}
    </Container>
  )
}

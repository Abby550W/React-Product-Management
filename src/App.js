import * as React from "react"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import Box from "@mui/material/Box"
import Tabletest from "./components/Tabletest"
import Header from "./components/Header"
import Login from "./components/Login"

const Private = ({ component: Component, ...rest }) => {
  const auth = !!localStorage.getItem("token")
  return auth ? <Component {...rest} /> : <Navigate to='/' />
}

export default function App(props) {
  const [search, setSearch] = React.useState("")
  const [editItem, setEditItem] = React.useState(false)
  const [searchVisible, setSearchVisible] = React.useState(true)

  return (
    <Router>
      <Box sx={{ width: "100%" }}>
        <Header
          setSearch={setSearch}
          editItem={editItem}
          searchVisible={searchVisible}
        />
      </Box>
      <Routes>
        <Route
          path='/products'
          element={
            <Private
              component={Tabletest}
              search={search}
              editItem={editItem}
              setEditItem={setEditItem}
              setSearchVisible={setSearchVisible}
            />
          }
        />
        <Route
          path='/'
          element={<Login setSearchVisible={setSearchVisible} />}
        />
      </Routes>
    </Router>
  )
}

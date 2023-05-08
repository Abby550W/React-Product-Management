import * as React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Input from "@mui/material/Input"
import InputLabel from "@mui/material/InputLabel"
import Typography from "@mui/material/Typography"
import LockIcon from "@mui/icons-material/Lock"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Login({ setSearchVisible }) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post("http://localhost:8000/api/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token)
        navigate("/products")
      })
      .catch((err) => console.log(err))
  }
  const inputRef = React.useRef()

  React.useEffect(() => {
    inputRef.current.focus()
    setSearchVisible(false)
  }, [])

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={6} sx={{ m: 6, width: 400, height: 400 }}>
        <Stack
          sx={{ m: 2 }}
          justifyContent='center'
          alignItems='center'
          spacing={0.5}
        >
          <LockIcon fontSize='large' color='success' />
          <Typography variant='h4' gutterBottom>
            Sign In
          </Typography>
        </Stack>
        <Stack
          sx={{ m: 2 }}
          component='form'
          onSubmit={handleSubmit}
          spacing={1}
        >
          <InputLabel>Eamil*</InputLabel>
          <Input
            fullWidth
            label='email'
            onChange={(e) => setEmail(e.target.value)}
            required
            ref={inputRef}
          />
          <InputLabel>Password*</InputLabel>
          <Input
            fullWidth
            label='password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button fullWidth variant='contained' type='submit'>
            Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

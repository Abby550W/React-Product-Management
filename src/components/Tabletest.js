import * as React from "react"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Paper from "@mui/material/Paper"
import { visuallyHidden } from "@mui/utils"
import Button from "@mui/material/Button"
import Input from "@mui/material/Input"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import UpgradeIcon from "@mui/icons-material/Upgrade"
import GetAppIcon from "@mui/icons-material/GetApp"
import "./Tabletest.css"
import * as XLSX from "xlsx"
import { getProducts, addProduct, updateProduct, deleteProduct } from "../api"

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  {
    id: "title",
    numeric: false,
    label: "Title",
  },
  {
    id: "description",
    numeric: false,
    label: "Description",
  },
  {
    id: "price",
    numeric: true,
    label: "Price",
  },
  {
    id: "image",
    numeric: false,
    label: "Image",
  },
  {
    id: "action",
    numeric: false,
    label: "Action",
  },
]

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

export default function EnhancedTable({
  search,
  editItem,
  setEditItem,
  setSearchVisible,
}) {
  const [order, setOrder] = React.useState("asc")
  const [orderBy, setOrderBy] = React.useState("")
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [product, setProduct] = React.useState({
    title: "",
    description: "",
    price: "",
    product_image: null,
    category_id: 99,
  })
  const token = localStorage.getItem("token")
  const [currentEdit, setCurrentEdit] = React.useState("")
  const [currentDelete, setCurrentDelete] = React.useState("")
  const [addrow, setAddrow] = React.useState(false)
  const [item, setItem] = React.useState([])
  const [formData, setFormData] = React.useState([])
  const [adding, setAdding] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [downLoad, setDownLoad] = React.useState(false)
  const [isDeleteClicked, setIsDeleteClicked] = React.useState(false)

  React.useEffect(() => {
    getProducts()
      .then((res) => {
        const data = res.data
        data.map((prod) => (prod.price = parseInt(prod.price)))
        setItem(data)
        setFormData(data)
      })
      .catch((err) => console.log(err))

    setSearchVisible(true)
  }, [])

  React.useEffect(() => {
    setItem(
      formData.filter((prod) => {
        if (
          (prod.title &&
            prod.title.toLowerCase().includes(search.toLowerCase())) ||
          (prod.description &&
            prod.description.toLowerCase().includes(search.toLowerCase()))
        ) {
          return prod
        }
        if (search === "") {
          return prod
        }
      })
    )
    setPage(0)
  }, [search])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }
  const handleAddClick = () => {
    if (!product.title.trim() || !product.price.trim()) {
      alert("Please enter a valid title or price.")
      return
    }
    const newData = new FormData()
    product.title && newData.append("title", product.title)
    product.price && newData.append("price", product.price)
    product.description && newData.append("description", product.description)
    product.product_image &&
      newData.append("product_image", product.product_image)
    newData.append("category_id", product.category_id)

    addProduct(newData)
      .then((res) => {
        const newProducts = [res.data, ...item]
        setItem(newProducts)
        setEditItem(false)
        setAddrow(false)
        setAdding(false)
        setDownLoad(false)
        console.log(res)
      })
      .catch((err) => console.log(err))
    setProduct({
      title: "",
      description: "",
      price: "",
      product_image: null,
      category_id: 99,
    })
  }
  const handleEditClick = (e, value) => {
    setCurrentEdit(item.find((c) => c.id === value))
    setEditItem((current) => !current)
    setAdding(!adding)
    setDownLoad(!downLoad)
  }
  const handleEditSave = () => {
    const newData = new FormData()
    newData.append("title", product.title)
    newData.append("description", product.description)
    newData.append("price", product.price)
    if (product.product_image) {
      newData.append("product_image", product.product_image)
    }
    newData.append("category_id", product.category_id)
    newData.append("_method", "put")

    updateProduct(currentEdit.id, newData)
      .then((res) => {
        console.log(item)
        const newProduct = [...item]
        const index = item.findIndex((prod) => prod.id === currentEdit.id)
        const editedProduct = { ...res.data, price: parseInt(res.data.price) }
        newProduct[index] = editedProduct
        setItem(newProduct)
        setEditItem((current) => !current)
        setAdding(!adding)
        setDownLoad(!downLoad)
      })
      .catch((err) => console.log(err))

    setProduct({
      title: "",
      description: "",
      price: "",
      product_image: null,
      category_id: 99,
    })
  }
  const handleCancelAdd = () => {
    setEditItem(false)
    setAdding(false)
    setDownLoad(false)
    setAddrow(false)
  }
  const handleCancelEdit = () => {
    setProduct((prevState) => {
      return { ...prevState, price: parseInt(prevState.price) }
    })
    setEditItem((current) => !current)
    setAdding(!adding)
    setDownLoad(!downLoad)
  }
  const handleClick = () => {
    setEditItem(false)
    setAddrow(true)
    setAdding(true)
    setDownLoad(false)
  }
  const handleDeleteClick = (e, value) => {
    setOpen(true)
    setCurrentDelete(item.find((c) => c.id === value))
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleConfirm = () => {
    setIsDeleteClicked(true)
    setOpen(false)
    setEditItem(false)
    setAdding(false)
    setDownLoad(false)
  }
  React.useEffect(() => {
    if (currentDelete.id && isDeleteClicked) {
      deleteProduct(currentDelete.id)
        .then((res) => {
          console.log(res)
          setItem(item.filter((a) => a.id !== currentDelete.id))
        })
        .catch((err) => console.log(err))
    }
  }, [currentDelete, isDeleteClicked])
  const handleDownload = () => {
    const sheetData = item.map((row) => [row.title, row.description, row.price])
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "table-data.xlsx")
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <IconButton color='primary' onClick={handleClick} disabled={adding}>
          <AddCircleIcon />
        </IconButton>
        <IconButton
          color='primary'
          onClick={handleDownload}
          disabled={downLoad}
        >
          <GetAppIcon />
        </IconButton>
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={item.length}
            />
            <TableBody>
              {addrow ? (
                <TableRow>
                  <TableCell align='center'>
                    <Input
                      placeholder='Title'
                      variant='outlined'
                      onChange={(e) =>
                        setProduct({ ...product, title: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <Input
                      placeholder='Description'
                      variant='outlined'
                      onChange={(e) =>
                        setProduct({ ...product, description: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <Input
                      placeholder='Price'
                      variant='plain'
                      type='number'
                      onChange={(e) =>
                        setProduct({ ...product, price: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='primary'
                      aria-label='upload picture'
                      component='label'
                    >
                      <input
                        hidden
                        accept='image/*'
                        type='file'
                        id='file'
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            product_image: e.target.files[0],
                          })
                        }
                      />
                      {product.product_image && (
                        <img
                          src={URL.createObjectURL(product.product_image)}
                          alt='Selected Image'
                        />
                      )}
                      <UpgradeIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='primary'
                      variant='contained'
                      type='submit'
                      onClick={() => handleAddClick()}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      color='primary'
                      onClick={() => handleCancelAdd()}
                    >
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ) : null}
              {stableSort(item, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <React.Fragment key={row.id}>
                      {editItem && currentEdit.id === row.id ? (
                        <TableRow hover tabIndex={-1} key={row.id}>
                          <TableCell key={row.id} align='center'>
                            <Input
                              placeholder={row.title}
                              onChange={(e) =>
                                setProduct({
                                  ...product,
                                  title: e.target.value,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell align='center'>
                            <Input
                              placeholder={row.description}
                              onChange={(e) =>
                                setProduct({
                                  ...product,
                                  description: e.target.value,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell align='center'>
                            <Input
                              type='number'
                              placeholder={row.price.toString()}
                              onChange={(e) =>
                                setProduct({
                                  ...product,
                                  price: e.target.value,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton
                              color='primary'
                              aria-label='upload picture'
                              component='label'
                            >
                              <input
                                hidden
                                accept='image/*'
                                type='file'
                                id='file'
                                onChange={(e) =>
                                  setProduct({
                                    ...product,
                                    product_image: e.target.files[0],
                                  })
                                }
                              />
                              {product.product_image ? (
                                <img
                                  src={URL.createObjectURL(
                                    product.product_image
                                  )}
                                  alt='Selected Image'
                                />
                              ) : row.product_image ? (
                                <img
                                  src={`https://app.spiritx.co.nz/storage/${row.product_image}`}
                                  alt={row.title}
                                />
                              ) : (
                                <span>No image available</span>
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton
                              color='primary'
                              onClick={(e) => handleEditSave()}
                            >
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              color='primary'
                              onClick={(e) => handleCancelEdit()}
                            >
                              <CloseIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <React.Fragment key={row.id}>
                          <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogContent>
                              <p>Do you want to delete this item?</p>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose} color='primary'>
                                Cancel
                              </Button>
                              <Button onClick={handleConfirm} color='primary'>
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <TableRow hover tabIndex={-1} key={row.id}>
                            <TableCell key={row.id} align='center'>
                              {row.title}
                            </TableCell>
                            <TableCell align='center'>
                              {row.description}
                            </TableCell>
                            <TableCell align='center' type='number'>
                              {row.price}
                            </TableCell>
                            <TableCell align='center'>
                              {row.product_image ? (
                                <img
                                  src={`https://app.spiritx.co.nz/storage/${row.product_image}`}
                                  alt={row.title}
                                />
                              ) : (
                                <span>No image available</span>
                              )}
                            </TableCell>
                            <TableCell align='center'>
                              <IconButton
                                color='primary'
                                onClick={(e) => handleEditClick(e, row.id)}
                                disabled={editItem}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color='primary'
                                onClick={(e) => handleDeleteClick(e, row.id)}
                                disabled={editItem}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={item.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}

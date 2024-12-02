import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { read, utils, writeFileXLSX } from "xlsx";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const onDownload = async (e) => {
    const file = e.target.files[0];
    const ab = await file.arrayBuffer();
    const wb = read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data1 = utils.sheet_to_json(ws);
    setData(data1);
  };
  const exportFile = () => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "Book.xlsx");
  };

  const onTextChange = (e, index) => {
    const newData = [...data];
    newData[index][e.target.name] = e.target.value;
    setData(newData);
  };
  const deleteRow = (key) => {
    const newData = [...data];
    newData.splice(key, 1);
    setData(newData);
  };

  const addRow = () => {
    const newObj = { firstName: "", lastName: "", phone: "" };
    const newData = [...data];
    newData.push(newObj);
    setData(newData);
  };
  return (
    <div className="App">
      <Box margin={2}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onDownload}
          variant="outlined"
        />
        <Button onClick={exportFile} variant="outlined">
          Export XLSX
        </Button>
        <Button onClick={addRow} variant="contained" sx={{ marginLeft: "5px" }}>
          Add Data
        </Button>
      </Box>
      {data && data?.length !== 0 ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((row, key) => (
                  <TableRow key={key}>
                    <TableCell>
                      <TextField
                        variant="standard"
                        size="small"
                        hiddenLabel
                        type="text"
                        name="firstName"
                        value={row.firstName}
                        onChange={(e) => onTextChange(e, key)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="standard"
                        size="small"
                        hiddenLabel
                        type="text"
                        name="lastName"
                        value={row.lastName}
                        onChange={(e) => onTextChange(e, key)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="standard"
                        size="small"
                        hiddenLabel
                        type="text"
                        name="phone"
                        value={row.phone}
                        onChange={(e) => onTextChange(e, key)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => deleteRow(key)}
                        color="error"
                        variant="outlined"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <>
          <Box>No Data Found</Box>
        </>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import jsonDB from '../apis/jsonDB';
import { DataGrid } from "@mui/x-data-grid";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });



const PaymentInvoice = () => {
    let [payment, setPayment] = useState();
    const [debt, setDebt] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
    setOpen(false);
    };

    const print = () => {
        window.print();
    }

    useEffect(() => {
        const fetchClass = async () => {
          const data = await jsonDB.get("/payments");
          setPayment(data.data);
        };
    
        fetchClass();
      }, []);

    useEffect(() => {
        // add sort based on priority
        const fetchDebt = async () => {
          const data = await jsonDB.get("/debt");
          console.log(data.data);
          setDebt(
            data.data
          );
        };
        fetchDebt();
      }, []);

    let gridData2 = {
        columns: [
            { field: "id", hide: true },
            { field: "name", headerName: "Client", width: 150 },
            {field: "paidDate", headerName: "Transaction Date", width: 150},
            {field: "price", headerName: "Class Price", width: 150},
            {field: "className", headerName: "Class Name", width: 150}
        ],
        rows: payment,
    };

    let gridData3 = {
        columns: [
            { field: "id", hide: true },
            { field: "debtType", headerName: "Expense Type", width: 300 },
            {field: "debtStartDate", headerName: "Debt Start Date", width: 150},
            {field: "debtAmount", headerName: "Debt Amount", width: 150},
            {field: "status", headerName: "Status", width: 150}
        ],
        rows: debt,
    };

    function getRevenue() {

        let total = 0;
        if (payment) {
            for (let i = 0; i < payment.length; i++) {
                total = total + parseInt((payment[i].price).substring(1));
            }
        }
    
        return total;
    };

    function getDebt() {

        let total = 0;
        if (debt) {
            for (let i = 0; i < debt.length; i++) {
                total = total + parseInt((debt[i].debtAmount).substring(1));
            }
        }
    
        return total;
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Invoice Statement as of {new Date().toISOString().slice(0, 10)}
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    >
                    <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Invoice Statement from 2022-03-14 to {new Date().toISOString().slice(0, 10)}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={print}>
                        Save As PDF
                    </Button>
                </Toolbar>
                </AppBar>
                
                <React.Fragment>
                <CssBaseline />
                <Container maxWidth="lg">
                    <Box sx={{ bgcolor: '#fff', height: '100vh' }} >
                        <br />
                        <br />
                        <a style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', textAlign: 'center', fontSize: '40px'}}>MEM Income Statement</a>
                        <br />
                        <br />
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Date: 2022-03-14 to {new Date().toISOString().slice(0, 10)}</a>
                        <br />
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Invoice #: 3</a>
                        <br />
                        <br />
                        <br />
                        <a style={{fontSize: '30px', color: 'black', marginLeft: '10%', fontWeight: 'bolder'}}>Revenue</a>
                        <br />
                        <br />
                        <DataGrid
                            autoHeight
                            
                            sx={{
                                marginLeft: '10%',
                                color: 'black',
                                width: '70%',
                              }}
                            {...gridData2}
                        />
                        <br/>
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Total Revenue: ${getRevenue()}.00</a>
                        <br />
                        <br />
                        <a style={{fontSize: '30px', color: 'black', marginLeft: '10%', fontWeight: 'bolder'}}>Expenses</a>
                        <br />
                        <br />
                        <DataGrid
                            autoHeight
                            
                            sx={{
                                marginLeft: '10%',
                                color: 'black',
                                width: '70%',
                              }}
                            {...gridData3}
                        />
                        <br/>
                        <br/>
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Total Expenses: ${getDebt()}.00</a>
                        <br/>
                        <br/>
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%', fontWeight: 'bolder'}}>Gross Profit: ${getRevenue() - getDebt()}.00</a>
                    </Box>
                    
                </Container>
                </React.Fragment>
            </Dialog>
        </div>
    );
};

export default PaymentInvoice;
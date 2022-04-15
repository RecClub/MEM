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



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });



const PaymentInvoice = () => {
    let [payment, setPayment] = useState();
    const [debt, setDebt] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
    setOpen(false);
    };

    const handleClickOpen2 = () => {
        setOpen2(true);
      };
    
    const handleClose2 = () => {
    setOpen2(false);
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



    let names = ['Jim', 'Bob', 'Mijal', 'Char', 'Nathan'];
    
    let randomNum = Math.floor(Math.random()*800);
    let randomNum2 = Math.floor(Math.random()*800);
    let randomNum3 = Math.floor(Math.random()*1000);
    let randomNum4 = Math.floor(Math.random()*1000);
    let randomNum5 = Math.floor(Math.random()*1000);
    let randomNum6 = Math.floor(Math.random()*1000);
    let randomNum7 = Math.floor(Math.random()*1000);

    let dat = [
        { id: 1, debtType: 'Coach ' + names[Math.floor(Math.random()*names.length)] + ' Expenses', debtStartDate: '2022-01-30', debtAmount: "$" + randomNum, status: 'Unpaid' },
        { id: 2, debtType: 'Coach ' + names[Math.floor(Math.random()*names.length)] + ' Expenses', debtStartDate: '2022-03-30', debtAmount: "$" + randomNum2, status: 'Unpaid'  },
      ]; 

    let classez = ['Zumba Class', 'Badminton Class', 'Basketball Class'];

    let gridData4 = {
        columns: [
            { field: "id", hide: true },
            { field: "debtType", headerName: "Expense Type", width: 300 },
            {field: "debtStartDate", headerName: "Debt Start Date", width: 150},
            {field: "debtAmount", headerName: "Debt Amount", width: 150},
            {field: "status", headerName: "Status", width: 150}
        ],
        rows: dat,
    };

    let dat2 = [
        { id: 1, name: names[Math.floor(Math.random()*names.length)], paidDate: '2022-01-30', price: "$" + randomNum3, status: 'Unpaid', className: classez[Math.floor(Math.random()*classez.length)] },
        { id: 2, name: names[Math.floor(Math.random()*names.length)], paidDate: '2022-02-24', price: "$" + randomNum4, status: 'Unpaid', className: classez[Math.floor(Math.random()*classez.length)]  },
        { id: 3, name: names[Math.floor(Math.random()*names.length)], paidDate: '2022-01-23', price: "$" + randomNum5, status: 'Unpaid', className: classez[Math.floor(Math.random()*classez.length)]  },
        { id: 4, name: names[Math.floor(Math.random()*names.length)], paidDate: '2022-02-20', price: "$" + randomNum6, status: 'Unpaid', className: classez[Math.floor(Math.random()*classez.length)]  },
        { id: 5, name: names[Math.floor(Math.random()*names.length)], paidDate: '2022-01-11', price: "$" + randomNum7, status: 'Unpaid', className: classez[Math.floor(Math.random()*classez.length)]  }
      ]; 

    let gridData5 = {
        columns: [
            { field: "id", hide: true },
            { field: "name", headerName: "Client", width: 150 },
            {field: "paidDate", headerName: "Transaction Date", width: 150},
            {field: "price", headerName: "Class Price", width: 150},
            {field: "className", headerName: "Class Name", width: 150}
        ],
        rows: dat2,
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
            Invoice Statements of the Year
            <br/>
            <Button variant="outlined" onClick={handleClickOpen}>
                Invoice Statement from 2022-03-14 to {new Date().toISOString().slice(0, 10)}
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
                <Container>
                    <Box sx={{ bgcolor: '#fff', height: '100vh'}} >
                        <br />
                        <br />
                        <a style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', textAlign: 'center', fontSize: '40px'}}>MEM Income Statement</a>
                        <br />
                        <br />
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Date: 2022-03-14 to {new Date().toISOString().slice(0, 10)}</a>
                        <br />
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Invoice #: 22225321</a>
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


            <Button variant="outlined" onClick={handleClickOpen2}>
                Invoice Statement from 2022-02-14 to 2022-03-14
            </Button>
            <Button variant="outlined" onClick={handleClickOpen2}>
                Invoice Statement from 2022-01-14 to 2022-02-14
            </Button>
            <Button variant="outlined" onClick={handleClickOpen2}>
                Invoice Statement from 2021-12-14 to 2022-01-14
            </Button>


            <Dialog
                fullScreen
                open={open2}
                onClose={handleClose2}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose2}
                    aria-label="close"
                    >
                    <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Previous Invoice Statement
                    </Typography>
                    <Button autoFocus color="inherit" onClick={print}>
                        Save As PDF
                    </Button>
                </Toolbar>
                </AppBar>
                
                <React.Fragment>
                <CssBaseline />
                <Container maxWidth="lg">
                    <Box sx={{ bgcolor: '#fff', height: '100vh'}} >
                        <br />
                        <br />
                        <a style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', textAlign: 'center', fontSize: '40px'}}>MEM Income Statement</a>
                        <br />
                        <br />
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Date: Previous Month of 2022</a>
                        <br />
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Invoice #: {Math.floor(Math.random()*22225321)}</a>
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
                            {...gridData5}
                        />
                        <br/>
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Total Revenue: ${randomNum3 + randomNum4 + randomNum5 + randomNum6 + randomNum7}.00</a>
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
                            {...gridData4}
                        />
                        <br/>
                        <br/>
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%'}}>Total Expenses: ${randomNum + randomNum2}.00</a>
                        <br/>
                        <br/>
                        <a style={{fontSize: '20px', color: 'black', marginLeft: '10%', fontWeight: 'bolder'}}>Gross Profit: ${randomNum3 + randomNum4 + randomNum5 + randomNum6 + randomNum7 - (randomNum + randomNum2)}.00</a>
                    </Box>
                    
                </Container>
                </React.Fragment>
            </Dialog>

            
        </div>
    );
};

export default PaymentInvoice;
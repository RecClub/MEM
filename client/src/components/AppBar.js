import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import NotificationsIcon from '@mui/icons-material/Notifications';

import userContext from '../contexts/UserContext';
import jsonDB from '../apis/jsonDB';

const pages = ['Coach', 'Member', 'Treasurer'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  let navigate = useNavigate();
  let [notifications, setNotifications] = useState([]);
  let { userID, setUserID, user } = useContext(userContext);

  useEffect(() => {
    if (!userID.userID) return;

    const fetchNotifications = async () => {
      const data = await jsonDB.get(`user_messages/${userID.userID}`);
      let messages = data.data.messages;
      messages.sort((message1, message2) => new Date(message2.date) - new Date(message1.date));
      setNotifications(data.data.messages);
    };

    fetchNotifications();

    const fetchInterval = setInterval(fetchNotifications, 10000);
    return () => {
      clearInterval(fetchInterval);
    };
  }, [userID]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = (page) => {
    navigate(`/${page}`);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = async (event) => {
    setAnchorElNotifications(event.currentTarget);
    setNotifications(notifications.map((notification) => {notification.read = true; return notification }));
    let data = await jsonDB.get(`/user_messages/${user.id}`);
    data.data.messages = notifications;
    await jsonDB.patch(`/user_messages/${user.id}`, data.data);
  };

  const unreadNotifications = () => {
    if (notifications.length === 0) return 0;
    return notifications.filter(notification => !notification.read).length;
  }

  const handleCloseNotifications = (event) => {
    setAnchorElNotifications(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Link to="/">RecClub</Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleMenuItemClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            <Link to="/">RecClub</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleMenuItemClick(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              onClick={handleOpenNotifications}
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={unreadNotifications()} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              sx={{ mt: '45px', maxWidth: '300px' }}
              id="menu-appbar"
              anchorEl={anchorElNotifications}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotifications}
            >
              {notifications.map((notification) => (
                <MenuItem key={notification.date+notification.sender} sx={{ textOverflow: 'ellipsis' }}>
                  <Box sx={{ maxWidth: 275 }}>
                    <CardContent>
                      <Typography style={{ wordWrap: "break-word", whiteSpace: "break-spaces"}} color="text.secondary" gutterBottom>
                        {notification.message}
                      </Typography>
                      <Typography sx={{ fontSize: 12 }} color="text.secondary">
                        {new Date(notification.date).toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontSize: 12 }} color="text.secondary">
                        From: {notification.sender}
                      </Typography>
                    </CardContent>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;

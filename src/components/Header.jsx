"use client";
import { useState } from "react";
import logoImg from "../assets/images/logo-Img.png";
import img1 from "../assets/images/offer-ride-profile-1.jpg";
import img2 from "../assets/images/offer-ride-profile-2.jpg";
import img3 from "../assets/images/offer-ride-profile-3.jpg";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import notification from "../assets/images/notification-icon.png";

import { RiLoginCircleLine } from "react-icons/ri";
import {
  FaUserCircle,
  FaRoute,
  FaCarSide,
  FaCar,
  FaSearchLocation,
} from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";

import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiInfo,
  FiHelpCircle,
} from "react-icons/fi";
import { CgMenuRightAlt } from "react-icons/cg";
import Link from "next/link";

import NotificationPanel from "./Notification";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";

const getNavLinks = (role, isLoggedIn) => [
  ...(role === "driver" || !isLoggedIn
    ? [{ label: "Offer a Ride", path: "/offer-ride", icon: <FaCarSide /> }]
    : []),
  ...(role === "passenger" || !isLoggedIn
    ? [{ label: "Book a Ride", path: "/find-ride", icon: <FaSearchLocation /> }]
    : []),
  { label: "About", path: "/about", icon: <FiInfo /> },
  { label: "Help", path: "/help-support", icon: <FiHelpCircle /> },
];

const getAccountLinks = (role) => [
  { label: "Profile", path: "/profile", icon: <FiUser /> },
  { label: "My Rides", path: "/my-rides", icon: <FaRoute /> },
  ...(role === "driver"
    ? [
        {
          label: "Vehicle Registration",
          path: "/vehicle-registration",
          icon: <FaCarSide />,
        },
        { label: "Vehicle Details", path: "/vehicle-details", icon: <FaCar /> },
      ]
    : []),
  { label: "Settings", path: "/settings", icon: <FiSettings /> },
];

const Header = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
   
  const isLoggedIn = !!user;
  const role = user?.role;
  const firstName = user?.name ? user.name.split(" ")[0] : "";

  const profilePicture = user?.user_details?.profile_picture || null;

  const [anchorEl, setAnchorEl] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Booking Request",
      body: "Pradyumna requested 2 seats for Mumbai → Pune.",
      time: "2 min ago",
      img: img1,
      read: false,
    },
    {
      id: 2,
      title: "Ride Confirmed",
      body: "Your ride to Bangalore has been confirmed.",
      time: "10 min ago",
      read: false,
      img: img2,
    },
    {
      id: 3,
      title: "Ride Confirmed",
      body: "Your ride to Bangalore has been confirmed.",
      time: "10 min ago",
      read: false,
      img: img2,
    },
    {
      id: 4,
      title: "Ride Confirmed",
      body: "Your ride to Bangalore has been confirmed.",
      time: "10 min ago",
      read: false,
      img: img2,
    },
    {
      id: 5,
      title: "Passenger Cancelled",
      body: "Amit cancelled his booking request.",
      time: "1 hour ago",
      read: true,
      img: img3,
    },
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleNotification = () => {
    setPanelOpen(true);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
  };

  const handleUpdateNotification = (id, updates) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logoutUser());
    setAnchorEl(null);
    setDrawerOpen(false);

    router.push("/login");
  };

  const navTo = (path) => {
    router.push(path);
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const navLinks = getNavLinks(role, isLoggedIn);
  const accountLinks = getAccountLinks(role);

  const ProfileAvatar = () =>
    profilePicture ? (
      <Image
        src={profilePicture}
        alt="user"
       fill
        unoptimized
      />
    ) : (
      <FaUserCircle size={51} />
    );

  const DrawerContent = (
    <Box sx={{ width: 260 }} role="presentation">
      {isLoggedIn && (
        <>
          <List>
            <ListItemButton>
              <div className="mob-logined-pic">
                <div className="user-profile-text">
                  <span className="user-greeting">Hi,</span>
                  <span className="user-role">{firstName}</span>
                </div>
                <div className="profile-img">
                  <ProfileAvatar />
                </div>
              </div>
            </ListItemButton>
          </List>
          <Divider />
        </>
      )}

      <List>
        {navLinks.map((item) => (
          <div key={item.label}>
            <ListItem disablePadding>
              <ListItemButton
                className="mobile-menu-sidebar"
                onClick={() => navTo(item.path)}
              >
                {item.icon}
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

      {isLoggedIn ? (
        <List>
          {accountLinks.map((item) => (
            <div key={item.label}>
              <ListItem disablePadding>
                <ListItemButton
                  className="mobile-menu-sidebar"
                  onClick={() => navTo(item.path)}
                >
                  {item.icon}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          ))}
          <ListItem disablePadding>
            <ListItemButton
              className="mobile-menu-sidebar logout"
              onClick={handleLogout}
              sx={{ color: "error.main" }}
            >
              <FiLogOut />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navTo("/login")}
              className="mobile-menu-sidebar"
            >
              <RiLoginCircleLine />
              <ListItemText primary="Log in" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navTo("/signup")}
              className="mobile-menu-sidebar"
            >
              <FaUserPlus />
              <ListItemText primary="Sign up" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <header>
      <Link className="header-logo" href="/">
        <div className="header-logo-icon">
          <Image src={logoImg} alt="Carpooling logo" priority />
        </div>
        Carpooling
      </Link>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {DrawerContent}
      </Drawer>

      <nav className="home-menus">
        {navLinks.map((item) => (
          <Link key={item.label} href={item.path}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="right-side-nav">
        {isLoggedIn && (
          <div className="notification" onClick={handleNotification}>
            <Image src={notification} alt="" width={24} height={24} />
            <p className="count">
              {notifications.filter((n) => !n.read).length}
            </p>
          </div>
        )}

        <nav className="menu-icon">
          <CgMenuRightAlt
            onClick={() => setDrawerOpen(true)}
            style={{ cursor: "pointer" }}
          />
        </nav>

        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <Link className="header-login-btn" href="/login">
                Log in
              </Link>
              <Link className="header-signup-btn" href="/signup">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                className="user-btn-logined"
              >
                <div className="user-profile-box">
                  <div className="user-profile-text">
                    <span className="user-greeting">Hi,</span>
                    <span className="user-role">{firstName}</span>
                  </div>
                  <div className="profile-img">
                    <ProfileAvatar />
                  </div>
                </div>
              </Button>

              {/* FIX: PaperProps forces 230px width — overrides MUI's inline JS style */}
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  style: {
                    minWidth: "250px",
                    width: "250px",
                    fontFamily: "'Vollkorn', serif",
                  },
                }}
              >
                {accountLinks.map((item) => (
                  <div key={item.label}>
                    <MenuItem
                      className="drawer-menus"
                      onClick={() => navTo(item.path)}
                    >
                      {item.icon} {item.label}
                    </MenuItem>
                    <Divider />
                  </div>
                ))}
                <MenuItem
                  className="drawer-menus logout"
                  onClick={handleLogout}
                >
                  <FiLogOut /> Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>

      <NotificationPanel
        open={panelOpen}
        onClose={handleClosePanel}
        notifications={notifications}
        onUpdate={handleUpdateNotification}
      />
    </header>
  );
};

export default Header;

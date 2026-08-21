"use client";
import { useEffect, useState } from "react";
import logoImg from "../assets/images/logo-Img.png";
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
import { LiaAngleRightSolid } from "react-icons/lia";
import INITIAL_NOTIFICATIONS from "@/constant/notification";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { LuMessageSquareMore } from "react-icons/lu";
import { FaUserAlt } from "react-icons/fa";
import { FaRocketchat } from "react-icons/fa";

import { FaUser } from "react-icons/fa6";

import notification from "../assets/images/notification-icon.png";
import { RiLoginCircleLine } from "react-icons/ri";
import {
  FaUserCircle,
  FaRoute,
  FaCarSide,
  FaCar,
  FaSearchLocation,
} from "react-icons/fa";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaUserPlus } from "react-icons/fa6";
import { VscGitPullRequestDone } from "react-icons/vsc";
import { FiUser, FiLogOut, FiInfo, FiHelpCircle } from "react-icons/fi";
import { CgMenuRightAlt } from "react-icons/cg";
import Link from "next/link";
import { SiCardmarket } from "react-icons/si";
import NotificationPanel from "./Notification";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { clearAuthCookies, getRole, getToken } from "@/lib/cookie";
import LogoutDialog from "./LogoutDialog";
import { usePathname } from "next/navigation";

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
  ...(role === "passenger"
    ? [
        { label: "Profile", path: "/passenger/profile", icon: <FaUser /> },
        { label: "My Rides", path: "/passenger/my-rides", icon: <FaRoute /> },
        // {
        //   label: "Notification",
        //   path: "/passenger/notification",
        //   icon: <MdOutlineNotificationsActive size={20} />,
        // },
        {
          label: "Find Ride",
          path: "/find-ride",
          icon: <FaSearchLocation size={16} />,
        },
      ]
    : []),
  ...(role === "driver"
    ? [
        { label: "Profile", path: "/driver/profile", icon: <FaUser /> },
        // {
        //   label: "Notification",
        //   path: "/driver/notification",
        //   icon: <MdOutlineNotificationsActive size={20} />,
        // },

        {
          label: "Messages",
          path: "/driver/chats",
          icon: <FaRocketchat size={16} />,
        },
        { label: "My Rides", path: "/driver/my-rides", icon: <FaRoute /> },
        // {
        //   label: "Published Rides",
        //   path: "/driver/published-rides",
        //   icon: <MdOutlinePublishedWithChanges size={18} />,
        // },
        {
          label: "Publish Ride",
          path: "/offer-ride",
          icon: <SiCardmarket size={15} />,
        },
        {
          label: "Booking Requests",
          path: "/driver/booking-requests",
          icon: <VscGitPullRequestDone size={18} />,
        },
        {
          label: "Vehicle Registration",
          path: "/driver/vehicle-registration",
          icon: <FaCarSide />,
        },
        {
          label: "Vehicle Details",
          path: "/driver/vehicle-details",
          icon: <FaCar />,
        },
        {
          label: "Earnings",
          path: "/driver/earnings",
          icon: <GiTakeMyMoney size={20} />,
        },
      ]
    : []),
];

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const pathname = usePathname();
  const [auth, setAuth] = useState({ isLoggedIn: false, role: null });

  useEffect(() => {
    setAuth({ isLoggedIn: !!getToken(), role: getRole() });
  }, []);

  const { isLoggedIn, role } = auth;

  const firstName = user?.name ? user.name.split(" ")[0] : "";
  const profilePicture =
    user?.user_details?.profile_picture || user?.profile_picture || null;
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleNotification = () => {
    setPanelOpen(true);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    clearAuthCookies();
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
      <Image src={profilePicture} alt="user" fill unoptimized />
    ) : (
      <FaUserCircle size={51} color="#1e40af" />
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
                  <span className="user-role">{firstName || "Guest"}</span>
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

                <ListItemText
                  primary={item.label}
                  sx={{ ml: 1 }}
                  className="mobile-menus"
                />

                <LiaAngleRightSolid className="move-forward" />
              </ListItemButton>
            </ListItem>
          </div>
        ))}
      </List>
      <Divider />

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
                  <ListItemText
                    primary={item.label}
                    sx={{ ml: 1 }}
                    className="mobile-menus"
                  />
                  <LiaAngleRightSolid className="move-forward" />
                </ListItemButton>
              </ListItem>
              {/* <Divider /> */}
            </div>
          ))}
          <ListItemButton
            className="mobile-menu-sidebar logout"
            onClick={() => {
              setDrawerOpen(false);
              setLogoutOpen(true);
            }}
            sx={{ color: "error.main" }}
          >
            <FiLogOut />
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navTo("/login")}
              className="cred-menu"
            >
              <RiLoginCircleLine />
              <ListItemText primary="Log in" />
            </ListItemButton>
          </ListItem>
          {/* <Divider />  */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navTo("/signup")}
              className="cred-menu"
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
    <>
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
            <Link
              key={item.label}
              href={item.path}
              className={pathname === item.path ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="right-side-nav">
          {isLoggedIn && (
            <Link
              className="notification"
              href={
                role === "driver"
                  ? "/driver/notification"
                  : "/passenger/notification"
              }
            >
              <Image src={notification} alt="" width={24} height={24} />
              <p className="count">
                {notifications.filter((n) => !n.read).length}
              </p>
            </Link>
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
                      <span className="user-role">{firstName || "Guest"}</span>
                    </div>
                    <div className="profile-img">
                      <ProfileAvatar />
                    </div>
                  </div>
                </Button>

                {/* FIX: PaperProps forces 250px width — overrides MUI's inline JS style */}
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      minWidth: 250,
                      width: 250,
                      borderRadius: "var(--fr-radius)",
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
                        <div className="menu-lables">
                          {item.icon}
                          <span className="mobile-menus-desktop">
                            {item.label}
                          </span>
                        </div>
                        <div className="move-forward">
                          <LiaAngleRightSolid />
                        </div>
                      </MenuItem>
                      {/* <Divider /> */}
                    </div>
                  ))}
                  <MenuItem
                    className="drawer-menus logout"
                    onClick={() => {
                      setAnchorEl(null);
                      setLogoutOpen(true);
                    }}
                  >
                    <FiLogOut /> Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>

        {/* <NotificationPanel
          open={panelOpen}
          onClose={handleClosePanel}
          notifications={notifications}
          onUpdate={handleUpdateNotification}
        /> */}
      </header>
      <LogoutDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Header;

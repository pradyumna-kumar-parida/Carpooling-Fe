"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
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
import { LiaAngleRightSolid } from "react-icons/lia";

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
import Image, { type StaticImageData } from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { clearAuthCookies, getRole, getToken } from "@/lib/cookie";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Role = "driver" | "passenger" | null;

type NavItem = {
  label: string;
  path: string;
  icon: ReactElement;
};

type AuthState = {
  isLoggedIn: boolean;
  role: Role;
};

type NotificationItem = {
  id: number;
  title: string;
  body: string;
  time: string;
  img: StaticImageData;
  read: boolean;
};

// Shape of the user object as consumed by this component. If a shared
// `User` type already exists in your redux slice, prefer importing that
// instead of this local one (e.g. `import type { User } from "@/redux/slices/authSlice"`).
type UserDetails = {
  profile_picture?: string | null;
};

type AuthUser = {
  name?: string;
  user_details?: UserDetails;
};

// Minimal slice of the redux store this component reads from. Replace with
// your real `RootState` type (e.g. `import type { RootState } from "@/redux/store"`)
// if one is exported — this local shape exists only so the file compiles
// standalone without assuming your store's full structure.
type RootState = {
  auth: {
    user: AuthUser | null;
  };
};

type ProfileAvatarProps = {
  profilePicture: string | null;
};

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

// Icons are pure/stateless, so we create each element ONCE at module load
// instead of re-creating them (and the arrays that hold them) on every
// render. This is what actually stops the repeated prefetch/re-render churn.
const ICONS: Record<string, ReactElement> = {
  offerRide: <FaCarSide />,
  findRide: <FaSearchLocation />,
  about: <FiInfo />,
  help: <FiHelpCircle />,
  profile: <FiUser />,
  myRides: <FaRoute />,
  findRideSmall: <FaSearchLocation size={16} />,
  publishedRides: <MdOutlinePublishedWithChanges size={18} />,
  offerRideSmall: <SiCardmarket size={17} />,
  bookingRequests: <VscGitPullRequestDone size={18} />,
  vehicleRegistration: <FaCarSide />,
  vehicleDetails: <FaCar />,
  earnings: <GiTakeMyMoney size={22} />,
};

const getNavLinks = (role: Role, isLoggedIn: boolean): NavItem[] => [
  ...(role === "driver" || !isLoggedIn
    ? [{ label: "Offer a Ride", path: "/offer-ride", icon: ICONS.offerRide }]
    : []),
  ...(role === "passenger" || !isLoggedIn
    ? [{ label: "Book a Ride", path: "/find-ride", icon: ICONS.findRide }]
    : []),
  { label: "About", path: "/about", icon: ICONS.about },
  { label: "Help", path: "/help-support", icon: ICONS.help },
];

const getAccountLinks = (role: Role): NavItem[] => [
  { label: "Profile", path: "/profile", icon: ICONS.profile },
  { label: "My Rides", path: "/my-rides", icon: ICONS.myRides },

  ...(role === "passenger"
    ? [{ label: "Find Ride", path: "/find-ride", icon: ICONS.findRideSmall }]
    : []),
  ...(role === "driver"
    ? [
        {
          label: "Published Rides",
          path: "/published-rides",
          icon: ICONS.publishedRides,
        },
        {
          label: "Offer Ride",
          path: "/offer-ride",
          icon: ICONS.offerRideSmall,
        },
        {
          label: "Booking Requests",
          path: "/booking-requests",
          icon: ICONS.bookingRequests,
        },
        {
          label: "Vehicle Registration",
          path: "/vehicle-registration",
          icon: ICONS.vehicleRegistration,
        },
        {
          label: "Vehicle Details",
          path: "/vehicle-details",
          icon: ICONS.vehicleDetails,
        },
        { label: "Earnings", path: "/earnings", icon: ICONS.earnings },
      ]
    : []),
];

// Mock data — hoisted out of the component so it isn't re-declared on every
// render (it's only ever used as the initial useState value anyway).
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "New Booking Request",
    body: "Pradyumna requested 2 seats for Mumbai to Pune.",
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
];

// Extracted so it isn't redefined (and remounted) on every Header render.
const ProfileAvatar = ({ profilePicture }: ProfileAvatarProps): ReactElement =>
  profilePicture ? (
    <Image src={profilePicture} alt="user" fill unoptimized />
  ) : (
    <FaUserCircle size={51} />
  );

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Header = (): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
  });
  const { isLoggedIn, role } = auth;

  useEffect(() => {
    setAuth({ isLoggedIn: !!getToken(), role: getRole() as Role });
  }, []);

  // Only rebuilt when role/isLoggedIn actually change — not on every render.
  const navLinks = useMemo(
    () => getNavLinks(role, isLoggedIn),
    [role, isLoggedIn],
  );
  const accountLinks = useMemo(() => getAccountLinks(role), [role]);

  // Prefetch runs once per real role/login change, not once per render.
  // NOTE: router.prefetch() does not reliably return a Promise across
  // Next.js versions, so we guard with try/catch instead of chaining .catch().
  useEffect(() => {
    [...navLinks, ...accountLinks].forEach((item) => {
      if (!item?.path) return;
      try {
        router.prefetch(item.path);
      } catch {
        // Prefetch is best-effort; ignore failures.
      }
    });
  }, [router, navLinks, accountLinks]);

  const firstName = user?.name ? user.name.split(" ")[0] : "";
  const profilePicture = user?.user_details?.profile_picture ?? null;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleNotification = useCallback(() => setPanelOpen(true), []);
  const handleClosePanel = useCallback(() => setPanelOpen(false), []);

  const handleUpdateNotification = useCallback(
    (id: number, updates: Partial<NotificationItem>) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updates } : n)),
      );
    },
    [],
  );

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    clearAuthCookies();
    setAnchorEl(null);
    setDrawerOpen(false);
    router.push("/login");
  }, [dispatch, router]);

  // Navigate immediately; no prefetch-on-click needed since links are
  // already prefetched by the effect above.
  const navTo = useCallback(
    (path: string) => {
      setAnchorEl(null);
      setDrawerOpen(false);
      router.push(path);
    },
    [router],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
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
                  <ProfileAvatar profilePicture={profilePicture} />
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
                <ListItemText primary={item.label} sx={{ ml: 1 }} />
                <LiaAngleRightSolid className="move-forward" />
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
                  <ListItemText primary={item.label} sx={{ ml: 1 }} />
                  <LiaAngleRightSolid className="move-forward" />
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
            <p className="count">{unreadCount}</p>
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
                    <span className="user-role">{firstName || "Guest"}</span>
                  </div>
                  <div className="profile-img">
                    <ProfileAvatar profilePicture={profilePicture} />
                  </div>
                </div>
              </Button>

              {/* PaperProps forces 250px width — overrides MUI's inline JS style */}
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: 250,
                      width: 250,
                      fontFamily: "'Vollkorn', serif",
                    },
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
                        <span>{item.label}</span>
                      </div>
                      <div className="move-forward">
                        <LiaAngleRightSolid />
                      </div>
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

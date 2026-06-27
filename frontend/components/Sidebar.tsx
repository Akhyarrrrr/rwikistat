import React, { useEffect, useState } from "react";
import { UserAuth } from "@/app/context/authContext";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import LinearProgress from "@mui/joy/LinearProgress";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TerminalIcon from "@mui/icons-material/Terminal";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import VerifiedIcon from "@mui/icons-material/Verified";
import SmsIcon from "@mui/icons-material/Sms";
import Image from "next/image";
import RwikiLogo from "@/public/logo-horizontal.png";
import HistoryIcon from "@mui/icons-material/History";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { closeSidebar } from "@/components/utils";
import { MdVerified } from "react-icons/md";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "0.2s ease",
          "& > *": {
            overflow: "hidden",
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const { user, userData, logOut } = UserAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        setIsAdmin(!!idTokenResult.claims?.admin);
      }).catch(() => setIsAdmin(false));
    }
  }, [user]);

  const photoURL = user?.photoURL || "";

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: {
          xs: "fixed",
          md: "sticky",
        },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          marginLeft: 3,
          marginTop: 2,
        }}
      >
        <Image src={RwikiLogo} alt={"Rwikistat Icon"} width={128} height={40} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 0.3,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            marginTop: 3,
          }}
        >
          <ListItem>
            <ListItemButton role="menuitem" component="a" href="/compiler">
              <IconButton size="md">
                <TerminalIcon />
              </IconButton>
              <ListItemContent>
                <Typography className="font-poppins" level="title-sm">
                  R Compiler
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton role="menuitem" component="a" href="/modul">
              <IconButton>
                <LibraryBooksIcon />
              </IconButton>
              <ListItemContent>
                <Typography className="font-poppins" level="title-sm">
                  Modul
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton role="menuitem" component="a" href="/forum">
              <IconButton>
                <QuestionAnswerRoundedIcon />
              </IconButton>
              <ListItemContent>
                <Typography className="font-poppins" level="title-sm">
                  Forum
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton role="menuitem" component="a" href="/chatbot">
              <IconButton>
                <SmsIcon />
              </IconButton>
              <ListItemContent>
                <Typography className="font-poppins" level="title-sm">
                  Chat Bot
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          {user && isAdmin === true && (
            <ListItem>
              <ListItemButton role="menuitem" component="a" href="/verified">
                <IconButton>
                  <SupervisorAccountIcon />
                </IconButton>
                <ListItemContent>
                  <Typography className="font-poppins" level="title-sm">
                    Manage User
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          )}

          {/* <ListItem>
            <ListItemButton role="menuitem" component="a" href="/riwayat">
              <IconButton>
                <HistoryIcon />
              </IconButton>
              <ListItemContent>
                <Typography level="title-sm">Riwayat Gambar</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem> */}

          <ListItem>
            <ListItemButton role="menuitem" component="a" href="/profile">
              <IconButton>
                <AccountCircleIcon />
              </IconButton>
              <ListItemContent>
                <Typography className="font-poppins" level="title-sm">
                  Profile
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>

        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        ></List>
      </Box>
      <Divider />
      {!user ? null : (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Image
            src={photoURL}
            alt="profile"
            width={30}
            height={30}
            className="rounded-full"
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <div className="flex items-center">
              <p className="-mt-1 text-base font-medium text-gray-900">
                {user.displayName}
              </p>
              {userData?.verified ? (
                <MdVerified size={18} className="mb-1 ml-1 text-[#00726B]" />
              ) : (
                ""
              )}
            </div>
            <Typography level="body-xs">{userData?.email}</Typography>
            {/* <Typography level="body-xs">{isAdmin}</Typography> */}
          </Box>
          <IconButton size="sm" variant="plain" color="neutral">
            <LogoutRoundedIcon onClick={handleSignOut} />
          </IconButton>
        </Box>
      )}
    </Sheet>
  );
}

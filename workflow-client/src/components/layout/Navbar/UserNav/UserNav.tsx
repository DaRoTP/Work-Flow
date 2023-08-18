import React from "react";

import { FaSignOutAlt, FaUserAlt, FaHome, FaBell, FaMoon, FaSun } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

import useGetCurrentUser from "@/service/useGetCurentUser";
import useGetNotifications from "@/service/useGetNotifications";
import useLogout from "@/service/useLogout";

import DropdownMenuItem from "@/components/general/DropdownMenu/DropdownMenuItem";
import Notification from "@/components/general/Notification";
import ThemeSwitch from "@/components/general/ThemeSwitch";

import NavItem from "@/components/layout/Navbar/NavItem";

import "../Navbar.scss";
import "./UserNav.scss";

const UserNav: React.FC = () => {
  const navigate = useNavigate();

  const { user, token, login, logout } = useAuth();
  const { mutate: logoutUser } = useLogout({
    onSuccess: () => {
      logout();
      navigate("/");
    },
  });

  useGetCurrentUser({
    onSuccess: (user) => {
      login({ user, token: token as string });
    },
  });

  const { data: notifications = [] } = useGetNotifications();

  const goToHomePage = () => {
    navigate("/dashboard");
  };

  const removeMessage = async (index: number) => {
    //
  };

  const handlGetMyNotifications = () => {
    //
  };

  return (
    <nav className="navbar">
      <ThemeSwitch />
      <NavItem name="home" onClick={goToHomePage} Icon={FaHome} />
      <NavItem
        name="profile"
        dropdownOffset={{ x: -60, y: 10 }}
        Icon={FaUserAlt}
        label={user.username}
        className="profile-nav"
      >
        <DropdownMenuItem>
          <Link to="/profile">
            <FaUserAlt /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FaMoon /> Theme Dark
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="logout-btn" onClick={() => logoutUser()}>
            <FaSignOutAlt /> logout
          </span>
        </DropdownMenuItem>
      </NavItem>
      <NavItem
        name="notiications"
        onClick={handlGetMyNotifications}
        dropdownOffset={{ x: -20, y: 10 }}
        className={`notification-nav ${notifications?.length ? "badge" : ""}`}
        dropdownMaxHeight={400}
        dropDownOnClickClose={false}
        Icon={FaBell}
      >
        {notifications.map((notification) => (
          <Notification notification={notification} />
        ))}
      </NavItem>
    </nav>
  );
};

export default UserNav;

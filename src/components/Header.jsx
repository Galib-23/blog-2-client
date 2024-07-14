import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSignOutAlt, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useEffect, useState } from "react";
import "./Header.css";
import Swal from "sweetalert2";
import { signOutSuccess } from "../redux/user/userSlice";

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const [isSpinning, setIsSpinning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(searchTerm);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleClick = () => {
    setIsSpinning(true);
    dispatch(toggleTheme());
    setTimeout(() => setIsSpinning(false), 500);
  };

  const handleSignout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sign Out",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch("https://blog-2-server.vercel.app/api/user/signout", {
            method: "POST",
            credentials: 'include',
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            dispatch(signOutSuccess());
            Swal.fire({
              title: "Signed Out",
              text: "You have successfully logged out",
              icon: "success",
            });
          }
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message || "Something went wrong!",
          });
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2"
      >Blog-23</Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Link to={`/search`} className="w-12 h-10 lg:hidden">
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch /> 
        </Button>
      </Link>
      <div className="flex items-center gap-2 md:order-2">
        <button
          onClick={handleClick}
          className={`w-9 h-9 rounded-full hidden sm:flex sm:justify-center sm:items-center border hover:shadow-lg hover:scale-105 transition-scale duration-300 ${
            theme === "dark" && "hover:shadow-slate-500 hover:shadow-2xl"
          }`}
        >
          {theme === "light" ? (
            <FaSun className={`text-yellow-400 ${isSpinning ? "spin" : ""}`} />
          ) : (
            <FaMoon className={`${isSpinning ? "spin" : ""}`} />
          )}
        </button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">
                {currentUser.username}
              </span>
              <span className="block text-sm">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item
              className="text-red-500 flex items-center gap-2"
              onClick={handleSignout}
            >
              Sign Out <FaSignOutAlt />
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link to={"/"}>
          <Navbar.Link active={path === "/"} as={"div"}>
            Home
          </Navbar.Link>
        </Link>
        <Link to={"/search"}>
          <Navbar.Link active={path === "/search"} as={"div"}>
            All Posts
          </Navbar.Link>
        </Link>
        <Link to="/about">
          <Navbar.Link active={path === "/about"} as={"div"}>
            About
          </Navbar.Link>
        </Link>
        <Link to="/projects">
          <Navbar.Link active={path === "/projects"} as={"div"}>
            Projects
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;

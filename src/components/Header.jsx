import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";

const Header = () => {

    const path = useLocation().pathname;
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);

  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg text-white">
          Galib&apos;s{" "}
        </span>{" "}
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex items-center gap-2 md:order-2">
        <button onClick={() =>dispatch(toggleTheme())} className={`w-9 h-9 rounded-full hidden sm:flex sm:justify-center sm:items-center border hover:shadow-lg hover:scale-105 transition-scale duration-300 ${theme === 'dark' && 'hover:shadow-slate-500 hover:shadow-2xl hover:text-yellow-100'}`}>
          {
            theme === 'light' ? <FaSun /> : <FaMoon />
          }
        </button>
        {
          currentUser ? (
            <Dropdown arrowIcon={false} inline label={
              <Avatar alt="User" img={currentUser.profilePicture} rounded />
            }>
              <Dropdown.Header>
                <span className="block text-sm font-semibold">{currentUser.username}</span>
                <span className="block text-sm">{currentUser.email}</span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item>
                Sign Out
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
            </Button>
        </Link>
          )
        }
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
            <Navbar.Link active={path === "/"} as={"div"}>
                <Link to='/'>
                    Home
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as={"div"}>
                <Link to='/about'>
                    About
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/projects"} as={"div"}>
                <Link to='/projects'>
                    Projects
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;

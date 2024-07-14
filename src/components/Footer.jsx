import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import myPhoto from "../assets/edit1.jpeg";
import { BsFacebook, BsGithub, BsInstagram } from "react-icons/bs";

const FooterCom = () => {
  return (
    <Footer container className="">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="flex flex-row sm:flex-col gap-8 md:gap-3">
            <Link
              to={"/"}
              className="self-center whitespace-nowrap text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-md px-5 py-2.5 text-center"
            >
              Blog-23
            </Link>
            <img className="w-24 h-24 rounded-xl" src={myPhoto} alt="" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://portfolio-galib.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My Portfolio
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow me" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.facebook.com/profile.php?id=100076476525666"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/asadullah-al"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Footer.Link>
                <Footer.Link
                  href="https://github.com/Galib-23"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Galib's Blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 mt-4 sm:justify-center">
            <Footer.Icon
              href="https://www.facebook.com/profile.php?id=100076476525666"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsFacebook}
            />
            <Footer.Icon
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/galibillustrations/"
              icon={BsInstagram}
            />
            <Footer.Icon
              href="https://github.com/Galib-23"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;

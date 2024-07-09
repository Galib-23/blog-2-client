import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import myPhoto from "../assets/edit1.jpeg";
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

const FooterCom = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="flex flex-row sm:flex-col gap-6">
            <Link
              to={"/"}
              className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg text-white">
                Galib&apos;s{" "}
              </span>{" "}
              Blog
            </Link>
            <img className="w-24 h-24 rounded-xl" src={myPhoto} alt="" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-8 sm:grid-cols-3 sm:gap-6">
            <div>
            <Footer.Title title="about" />
            <Footer.LinkGroup col >
              <Footer.Link href="https://portfolio-galib.web.app/" target="_blank" rel="noopener noreferrer" >
                My Portfolio
              </Footer.Link>
              <Footer.Link href="/about" target="_blank" rel="noopener noreferrer" >
                My Blog
              </Footer.Link>
            </Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title="Follow me" />
            <Footer.LinkGroup col >
              <Footer.Link href="https://www.facebook.com/profile.php?id=100076476525666" target="_blank" rel="noopener noreferrer" >
                Facebook
              </Footer.Link>
              <Footer.Link href="www.linkedin.com/in/asadullah-al" target="_blank" rel="noopener noreferrer" >
                LinkedIn
              </Footer.Link>
              <Footer.Link href="https://github.com/Galib-23" target="_blank" rel="noopener noreferrer" >
                Github
              </Footer.Link>
            </Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title="legal" />
            <Footer.LinkGroup col >
              <Footer.Link href="" target="_blank" rel="noopener noreferrer" >
                Privacy Policy
              </Footer.Link>
              <Footer.Link href="" target="_blank" rel="noopener noreferrer" >
                Terms & Conditions
              </Footer.Link>
            </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Galib's Blog" year={new Date().getFullYear()}/>
          <div className="flex gap-6 mt-4 sm:justify-center">
          <Footer.Icon href="#" icon={BsFacebook} />
          <Footer.Icon href="#" icon={BsInstagram} />
          <Footer.Icon href="#" icon={BsTwitter} />
          <Footer.Icon href="#" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;

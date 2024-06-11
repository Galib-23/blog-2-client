import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";

const SignUp = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center">
        {/* left section */}
        <div className=" flex-1">
          <Link
            to={"/"}
            className="whitespace-nowrap text-4xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg text-white">
              Galib&apos;s{" "}
            </span>{" "}
            Blog
          </Link>
          <p className="text-sm mt-5">
            Hey there! I am Asadullah Al Galib. Welcome to my blog website. I
            upload my views on different topics and genres here regularly. Sign
            up for free and stay updated about myself.
          </p>
        </div>

        {/* right section */}
        <div className="flex-1">
          <form className="flex flex-col gap-5">
            <div>
              <Label value="Your username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput type="email" placeholder="Email" id="email" />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="Password" id="password" />
            </div>
            <Button gradientMonochrome="cyan" type="submit">Sign Up</Button>
          </form>
          <div className="flex gap-2 text-sm mt-5 justify-center">
            <span>Already have an account?</span>
            <Link to={'/sign-in'} className="text-blue-500 font-semibold">
            Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

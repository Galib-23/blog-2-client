import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import OAuth from "../components/OAuth";

const SignUp = () => {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    })
    console.log(formData);

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage("Please fill out all the fields")
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('https://blog-2-server.vercel.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      navigate('/sign-in')
    } catch (error) {
      console.log(error)
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-6xl mx-auto flex-col md:flex-row md:items-center gap-6 md:gap-16">
        {/* left section */}
        <div className="flex-1">
          <div className="flex flex-col items-center sm:items-start gap-3 sm:gap-2">
          <Link
            to={"/"}
            className="whitespace-nowrap text-4xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg text-white">
              Galib&apos;s{" "}
            </span>{" "}
            Blog
          </Link>
          <p className="text-sm mt-5 text-center sm:text-start">
            Hey there! I am Asadullah Al Galib. Welcome to my blog website. I
            upload my views on different topics and genres here regularly. Sign
            up for free and stay updated about myself.
          </p>
          </div>
        </div>

        {/* right section */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <Label value="Your username" />
              <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput type="email" placeholder="Email" id="email" onChange={handleChange} />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
            </div>
            <Button gradientMonochrome="cyan" type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : "Sign Up"
              }
            </Button>
            <h2 className="text-lg font-semibold text-center">Or,</h2>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5 justify-center">
            <span>Already have an account?</span>
            <Link to={'/sign-in'} className="text-blue-500 font-semibold">
            Sign In</Link>
          </div>
          {
            errorMessage && (
              <Alert className="mt-5" color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { SignInStart, signInFailure, signInSuccess } from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

const SignIn = () => {

  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, errorMessage } = useSelector(state => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    })
    console.log(formData);

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password){
      return dispatch(signInFailure("Please fill out all the fields"));
    }
    try {
      dispatch(SignInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log(error)
      dispatch(signInFailure(error.message));
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
                ) : "Sign In"
              }
            </Button>
            <h2 className="text-lg font-semibold text-center">Or,</h2>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5 justify-center">
            <span>Don&apos;t have an account?</span>
            <Link to={'/sign-up'} className="text-blue-500 font-semibold">
            Sign Up</Link>
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

export default SignIn;

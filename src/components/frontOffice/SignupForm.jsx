"use client";
// import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";

export default function SignupForm({ role = "USER" }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  async function onSubmit(data) {
    try {
      data.role = role;
      console.log(data);
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        setLoading(false);
        toast.success("User Created Successfully");
        console.log(responseData.data);
        reset();
        router.push(`/verify-account/${responseData.data.id}`);
        // if role =user => home
        // if role =farmer=>onboarding
        // if (role === "CANDIDATE") {
        //   router.push("/");
        // } else {
        //   router.push("/verify-email");
        // }
      } else {
        setLoading(false);
        if (response.status === 409) {
          setEmailErr("User with this Email already exists");
          toast.error("User with this Email already exists");
        } else {
          // Handle other errors
          console.error("Server Error:", responseData.message);
          toast.error("Oops Something Went wrong");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Something Went wrong, Please Try Again");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      {/* role */}
      <TextInput
        label=""
        name="role"
        type="hidden"
        defaultValue={role}
        register={register}
        errors={errors}
        className="sm:col-span-2 mb-3"
      />

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        {/* first name */}
        <TextInput
          label="Name"
          name="name"
          type="text"
          register={register}
          errors={errors}
          className="sm:col-span-2 mb-3 w-full"
          placeholder="John Doe"
        />
      </div>

      {/* email */}
      <TextInput
        label="Email"
        name="email"
        type="email"
        placeholder="johndoe@comany.com"
        register={register}
        errors={errors}
        className="sm:col-span-2 mb-3"
      />
      {emailErr && (
        <small className="text-red-600 -mt-2 mb-2">{emailErr}</small>
      )}
      {/* password */}
      <TextInput
        label="Password"
        name="password"
        type="password"
        placeholder="******"
        register={register}
        errors={errors}
        className="sm:col-span-2 mb-3"
      />
      <SubmitButton
        buttonTitle="Register"
        isLoading={loading}
        loadingButtonTitle="Creating Please Wait"
      />
      <div className="flex gap-2 justify-between">
        <p className="text-[0.75rem] font-light text-gray-500 dark:text-gray-400 py-4">
          Already have an account ?{" "}
          <Link
            href="/login"
            className="font-medium text-purple-600 hover:underline dark:text-purple-500"
          >
            Login
          </Link>
        </p>
        {role === "CANDIDATE" ? (
          <p className="text-[0.75rem] font-light text-gray-500 dark:text-gray-400 py-4">
            Are you a Recruiter ?{" "}
            <Link
              href="/signup-client"
              className="font-medium text-purple-600 hover:underline dark:text-purple-500"
            >
              Register here
            </Link>
          </p>
        ) : (
          <p className="text-[0.75rem] font-light text-gray-500 dark:text-gray-400 py-4">
            Are you a CANDIDATE ?{" "}
            <Link
              href="/signup"
              className="font-medium text-purple-600 hover:underline dark:text-purple-500"
            >
              Register here
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}

"use client";
// import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  // const [emailErr, setEmailErr] = useState("");

  async function onSubmit(data) {
    console.log(data);
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/api/users/forgot-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        // console.log(response);
        setLoading(false);
        setShowNotification(true);
        reset();
        toast.success("Password reset link sent Successfully");
      } else {
        setLoading(false);
        toast.error("Something Went wrong");
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong with your Network");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      {showNotification && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Please Check your Email!</span> We have
          sent you a Password Reset Link. Click on the Link in order to Reset
          your Password. Thank you!
        </Alert>
      )}

      {/* email */}
      <TextInput
        label="Email"
        name="email"
        type="email"
        placeholder="johndoe@company.com"
        register={register}
        errors={errors}
        className="sm:col-span-2 mb-3"
      />
      {/* {emailErr && (
        <small className="text-red-600 -mt-2 mb-2">{emailErr}</small>
      )} */}
      {/* {errors.email && (
        <small className="text-red-600 text-sm -mt-2 mb-2">
          This field is required
        </small>
      )} */}
      <SubmitButton
        buttonTitle="Send Password Reset Link"
        isLoading={loading}
        loadingButtonTitle="Sending Please Wait"
      />
      <div className="flex gap-2 justify-between">
        <p className="text-[0.75rem] font-light text-gray-500 dark:text-gray-400 py-4">
          Remember Password ?{" "}
          <Link
            href="/login"
            className="font-medium text-purple-600 hover:underline dark:text-purple-500"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}

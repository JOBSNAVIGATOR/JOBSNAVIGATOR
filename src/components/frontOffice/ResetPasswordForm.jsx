"use client";
// import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    // console.log(data);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    data.id = id;
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/users/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setLoading(false);
        toast.success("Password Updated Successfully");
        router.push("/login");
      } else {
        setLoading(false);
        toast.error("Something Went wrong");
      }
    } catch (error) {
      setLoading(false);
      // console.error("Network Error:", error);
      toast.error("Its seems something is wrong with your Network");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
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
        buttonTitle="Reset Password"
        isLoading={loading}
        loadingButtonTitle="Updating Please Wait"
      />
    </form>
  );
}

"use client";
// import ImageInput from "@/components/FormInputs/ImageInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
// import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
// import { generateUserCode } from "@/lib/generateUserCode";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function ConsultantForm({ user, updateData = {} }) {
  //   const initialImageUrl = updateData?.farmerProfile?.profileImageUrl ?? "";
  const id = updateData?.farmerProfile?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  //   const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
      ...user,
      ...updateData.consultantProfile,
    },
  });

  async function onSubmit(data) {
    // const code = generateUserCode("JOBSNV", data.name);
    // data.code = code;
    // data.imageUrl = imageUrl;
    console.log(data);
    // if (id) {
    //   // make put request (update)
    //   console.log(id);
    //   data.userId = updateData?.id;
    //   makePutRequest(
    //     setLoading,
    //     `api/farmers/${id}`,
    //     data,
    //     "Farmer Profile",
    //     reset
    //   );
    //   setImageUrl("");
    //   router.back();
    //   console.log("Update Request:", data);
    // } else {
    //   // make post request (create)
    //   console.log("2");
    //   data.userId = user.id;
    //   makePostRequest(setLoading, "api/farmers", data, "Farmer Profile", reset);
    //   setImageUrl("");
    //   router.push("/login");
    // }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-emerald-500 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput
          label="First Name"
          name="firstName"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Last Name"
          name="lastName"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Contact Number"
          name="phone"
          type="tel"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Emergency Contact Number"
          name="emergencyPhone"
          type="tel"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Email Address"
          name="email"
          type="email"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="House Number"
          name="houseNumber"
          register={register}
          errors={errors}
          className="w-full"
          type="number"
        />
        <TextInput
          label="Street Address"
          name="street"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Locality"
          name="locality"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="City"
          name="city"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="State"
          name="state"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Country"
          name="country"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextInput
          label="Aadhar Number"
          name="aadharNumber"
          register={register}
          errors={errors}
          className="w-full"
          type="number"
        />
        <TextInput
          label="PAN Number"
          name="panNumber"
          register={register}
          errors={errors}
          className="w-full"
          type="number"
        />
        <TextInput
          label="CTC Offered"
          name="ctcOffered"
          register={register}
          errors={errors}
          className="w-full"
          type="number"
        />
      </div>
      <br />
      <br />
      <br />

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Consultant" : "Create Consultant"}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Consultant Please wait ...`}
      />
    </form>
  );
}

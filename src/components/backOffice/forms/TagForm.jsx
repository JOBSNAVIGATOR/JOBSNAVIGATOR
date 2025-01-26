"use client";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextAreaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { useSession } from "next-auth/react";
// import { makePostRequest, makePutRequest } from "@/lib/apiRequest";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function TagForm({ updateData = {} }) {
  const id = updateData?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  if (status === "loading") {
    <div className="flex justify-center items-center h-screen">
      <AnimatedBoxes />
    </div>;
  }
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...updateData,
      name: updateData?.name ? updateData?.name : "",
      description: updateData?.description ? updateData?.description : "",
    },
  });

  async function onSubmit(data) {
    try {
      if (id) {
        data.updatedByName = session?.user?.name;
        data.updatedById = session?.user?.name;
        // console.log("updateddddd", data);
        // make put request (update)
        makePutRequest(setLoading, `api/tags/${id}`, data, "Tag", reset);
        router.back();
        // console.log("Update Request:", data);
      } else {
        data.createdByName = session?.user?.name;
        data.createdById = session?.user?.id;

        // console.log("POst Data", data);
        // make post request (create)
        makePostRequest(setLoading, "api/tags", data, "Tag", reset);
        router.back();
      }
    } catch (error) {
      // console.error("Error converting image to base64:", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-emerald-500 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput
          label="Tag Name"
          name="name"
          register={register}
          errors={errors}
          className="w-full"
        />
        <TextAreaInput
          label="Tag Description"
          name="description"
          register={register}
          errors={errors}
        />
      </div>
      <br />
      <br />
      <br />

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Tag" : "Create Tag"}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Tag Please wait ...`}
      />
    </form>
  );
}

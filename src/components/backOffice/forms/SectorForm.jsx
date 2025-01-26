"use client";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextInput from "@/components/FormInputs/TextInput";
import AnimatedBoxes from "@/components/ui/AnimatedBoxes";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function SectorForm({ updateData = {} }) {
  const id = updateData?.id ?? "";
  const initialDomains = updateData?.domains ?? [];
  const [domains, setDomains] = useState(initialDomains);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...updateData,
      name: updateData?.sectorName,
    },
  });

  async function onSubmit(data) {
    // Convert sector name to uppercase
    data.name = data.name.toUpperCase();
    data.domains = domains.map((domain) => domain.toUpperCase());
    try {
      if (id) {
        // console.log("updateddddd", data);
        // make put request (update)
        makePutRequest(setLoading, `api/sectors/${id}`, data, "Sector", reset);
        // router.back();
        // console.log("Update Request:", data);
      } else {
        // console.log("POst Data", data);
        // make post request (create)
        makePostRequest(setLoading, "api/sectors", data, "Sector", reset);
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
          label="Sector Name"
          name="name"
          register={register}
          errors={errors}
          className="w-full"
        />
        <ArrayItemsInput
          itemTitle="Domains"
          items={domains}
          setItems={setDomains}
          defaultValues={updateData?.sector?.domains}
        />
      </div>
      <br />
      <br />
      <br />

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Sector & Domains" : "Create Sector & Domains"}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Sector & Domains Please wait ...`}
      />
    </form>
  );
}

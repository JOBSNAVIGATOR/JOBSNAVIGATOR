// "use client";
// import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
// import SelectInput from "@/components/FormInputs/SelectInput";
// import SubmitButton from "@/components/FormInputs/SubmitButton";
// import TextAreaInput from "@/components/FormInputs/TextAreaInput";
// import TextInput from "@/components/FormInputs/TextInput";
// import { sectors } from "@/data";

// import { useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";

// export default function JobForm({
//   companies = [],
//   clients = [],
//   updateData = {},
// }) {
//   const initialSkills = updateData?.skills ?? [];
//   const id = updateData?.id ?? "";
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     reset,
//     watch,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       ...updateData,
//     },
//   });

//   const [skills, setSkills] = useState(initialSkills);

//   // Watch for changes in sectorId and domainId
//   const selectedSectorId = watch("sectorId");
//   const selectedDomainId = watch("domainId");

//   useEffect(() => {
//     console.log("Selected Sector ID:", selectedSectorId);
//     console.log("Selected Domain ID:", selectedDomainId);
//   }, [selectedSectorId, selectedDomainId]);

//   // Find selected sector
//   const selectedSector = sectors.find(
//     (sector) => sector.sectorId === Number(selectedSectorId)
//   );
//   const domains = selectedSector ? selectedSector.domains : [];
//   const selectedDomain = domains.find(
//     (domain) => domain.domainId === Number(selectedDomainId)
//   );
//   const levels = selectedDomain ? selectedDomain.levels : [];

//   console.log(sectors);

//   async function onSubmit(data) {
//     data.jobCode = "BJSXSJXVSXVS";
//     data.skills = skills;
//     console.log(data);
//     // Handle form submission logic
//     // if (id) {
//     //   data.id = id;
//     //   // make put request (update)
//     //   console.log("1");
//     //   makePutRequest(setLoading, `api/products/${id}`, data, "Product", reset);
//     //   setImageUrl("");
//     //   setTags([]);
//     //   router.back();
//     //   console.log("Update Request:", data);
//     // } else {
//     //   // make post request (create)
//     //   console.log("2");
//     //   makePostRequest(setLoading, "api/products", data, "Product", reset);
//     //   setImageUrl("");
//     //   setTags([]);
//     //   router.back();
//     // }
//   }

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-emerald-500 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
//     >
//       <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
//         <SelectInput
//           label="Select Sector"
//           name="sectorId"
//           register={register}
//           errors={errors}
//           className="w-full"
//           options={sectors.map((sector) => ({
//             id: sector.sectorId,
//             title: sector.sectorName,
//           }))}
//         />

//         <SelectInput
//           label="Select Company"
//           name="companyId"
//           register={register}
//           errors={errors}
//           className="w-full"
//           options={companies.map((company) => ({
//             id: company.id,
//             title: company.name,
//           }))}
//         />

//         <SelectInput
//           label="Select Domain"
//           name="domainId"
//           register={register}
//           errors={errors}
//           className="w-full"
//           options={domains.map((domain) => ({
//             id: domain.domainId,
//             title: domain.domainName,
//           }))}
//         />

//         <SelectInput
//           label="Select Profile"
//           name="levelId"
//           register={register}
//           errors={errors}
//           className="w-full"
//           options={levels.map((level) => ({
//             id: level.levelId,
//             title: level.levelName,
//           }))}
//         />

//         <SelectInput
//           label="Select Client HR"
//           name="clientHrId"
//           register={register}
//           errors={errors}
//           className="w-full"
//           options={clients.map((client) => ({
//             id: client.id,
//             title: client.name,
//           }))}
//         />

//         <TextInput
//           label="Number of Vacancies"
//           type="number"
//           name="totalVacancies"
//           register={register}
//           errors={errors}
//           className="w-full"
//         />

//         <ArrayItemsInput
//           items={skills}
//           setItems={setSkills}
//           itemTitle="Skills"
//         />

//         <TextAreaInput
//           label="Job Description"
//           name="jobDescription"
//           register={register}
//           errors={errors}
//         />
//       </div>
//       <br />

//       <SubmitButton
//         isLoading={loading}
//         buttonTitle={id ? "Update Job" : "Create Job"}
//         loadingButtonTitle={`${
//           id ? "Updating" : "Creating"
//         } Job Please wait ...`}
//       />
//     </form>
//   );
// }

"use client";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import SelectInput from "@/components/FormInputs/SelectInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextAreaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import { sectors } from "@/data";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function JobForm({
  companies = [],
  clients = [],
  updateData = {},
}) {
  const initialSkills = updateData?.skills ?? [];
  const id = updateData?.id ?? "";
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
    },
  });

  const [skills, setSkills] = useState(initialSkills);

  // Initialize selectedSectorId and selectedDomainId from updateData if available
  const initialSectorId = updateData?.sectorId ?? "";
  const initialDomainId = updateData?.domainId ?? "";

  // Watch for changes in sectorId and domainId
  const selectedSectorId = watch("sectorId", initialSectorId);
  const selectedDomainId = watch("domainId", initialDomainId);

  useEffect(() => {
    console.log("Selected Sector ID:", selectedSectorId);
    console.log("Selected Domain ID:", selectedDomainId);
  }, [selectedSectorId, selectedDomainId]);

  // Find selected sector
  const selectedSector = sectors.find(
    (sector) => sector.sectorId === Number(selectedSectorId)
  );
  const domains = selectedSector ? selectedSector.domains : [];
  const selectedDomain = domains.find(
    (domain) => domain.domainId === Number(selectedDomainId)
  );
  const levels = selectedDomain ? selectedDomain.levels : [];

  async function onSubmit(data) {
    data.jobCode = "BJSXSJXVSXVS";
    data.skills = skills;
    console.log(data);
    // Handle form submission logic
    // if (id) {
    //   data.id = id;
    //   // make put request (update)
    //   console.log("1");
    //   makePutRequest(setLoading, `api/products/${id}`, data, "Product", reset);
    //   setImageUrl("");
    //   setTags([]);
    //   router.back();
    //   console.log("Update Request:", data);
    // } else {
    //   // make post request (create)
    //   console.log("2");
    //   makePostRequest(setLoading, "api/products", data, "Product", reset);
    //   setImageUrl("");
    //   setTags([]);
    //   router.back();
    // }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-emerald-500 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <SelectInput
          label="Select Sector"
          name="sectorId"
          register={register}
          errors={errors}
          className="w-full"
          options={sectors.map((sector) => ({
            id: sector.sectorId,
            title: sector.sectorName,
          }))}
        />

        <SelectInput
          label="Select Company"
          name="companyId"
          register={register}
          errors={errors}
          className="w-full"
          options={companies.map((company) => ({
            id: company.id,
            title: company.name,
          }))}
        />

        <SelectInput
          label="Select Domain"
          name="domainId"
          register={register}
          errors={errors}
          className="w-full"
          options={domains.map((domain) => ({
            id: domain.domainId,
            title: domain.domainName,
          }))}
        />

        {/* <SelectInput
          label="Select Profile"
          name="levelId"
          register={register}
          errors={errors}
          className="w-full"
          options={levels.map((level) => ({
            id: level.levelId,
            title: level.levelName,
          }))}
        /> */}

        <SelectInput
          label="Select Client HR"
          name="clientHrId"
          register={register}
          errors={errors}
          className="w-full"
          options={clients.map((client) => ({
            id: client.id,
            title: client.name,
          }))}
        />

        <TextInput
          label="Number of Vacancies"
          type="number"
          name="totalVacancies"
          register={register}
          errors={errors}
          className="w-full"
          placeholder="Positions Remaining"
        />

        <ArrayItemsInput
          items={skills}
          setItems={setSkills}
          itemTitle="Skills"
        />

        <TextAreaInput
          label="Job Description"
          name="jobDescription"
          register={register}
          errors={errors}
        />
      </div>
      <br />

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Job" : "Create Job"}
        loadingButtonTitle={`${
          id ? "Updating" : "Creating"
        } Job Please wait ...`}
      />
    </form>
  );
}

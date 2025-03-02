"use client";
import SelectInputThree from "@/components/FormInputs/SelectInputThree";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { BottomGradient } from "@/components/ui/BottomGradient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { makePutRequest } from "@/lib/apiRequest";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
export default function ConsultantRole({ consultant }) {
  console.log("hii", consultant);

  const [rolesData, setRolesData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    reset,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...(consultant || {}),
    },
  });

  // Fetch sectors and domains on component mount
  useEffect(() => {
    async function fetchRoles() {
      const response = await fetch("/api/roles");
      const data = await response.json();
      setRolesData(data);
    }
    fetchRoles();
  }, [consultant]);

  async function onSubmit(data) {
    console.log(data);
    try {
      console.log("hello");

      makePutRequest(
        setLoading,
        "api/consultants/assignRole",
        data,
        "Role",
        reset
      );
      setOpen(false);
    } catch (error) {
      console.log(error);

      alert("Failed to update Role.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 dark:bg-zinc-800 w-48 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center gap-2">
          Consultant Role
          <Settings2 />
          <BottomGradient />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
        <DialogHeader className="flex flex-col items-center justify-between gap-2">
          <DialogTitle className="">Select The Consultant Role</DialogTitle>
          <br />
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8">
            <SelectInputThree
              label="Role"
              name="roleId"
              register={register("roleId", { required: true })} // Ensure sector is registered
              errors={errors}
              className="w-full"
              options={rolesData.map((role) => ({
                value: role.id,
                label: role.name,
              }))}
            />
            <SubmitButton
              isLoading={loading}
              buttonTitle="Update Role"
              loadingButtonTitle="Updating Role Please wait ..."
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

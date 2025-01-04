"use client";
import React, { useEffect, useState } from "react";
import { BottomGradient } from "./BottomGradient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AnimatedBoxes from "./AnimatedBoxes";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function SendMailButton({
  data,
  templateName,
  subject,
  content,
}) {
  // console.log("test11", data);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedReceivers, setSelectedReceivers] = useState([]);

  const { data: session, status } = useSession();
  if (status === "loading") {
    // <Loading />;
    <AnimatedBoxes />;
  }
  const userName = session?.user?.name;

  // Initialize all receivers as selected by default
  useEffect(() => {
    if (data?.length) {
      setSelectedReceivers(data.map((item) => item.id));
    }
  }, [data]);

  const handleCheckboxChange = (id) => {
    setSelectedReceivers((prev) =>
      prev.includes(id)
        ? prev.filter((receiverId) => receiverId !== id)
        : [...prev, id]
    );
  };

  const handleSendEmails = async () => {
    try {
      // Prepare the updatedData by filtering the selected receivers
      const updatedData = data.filter((item) =>
        selectedReceivers.includes(item.id)
      );
      // console.log("data", data);
      // console.log("receivers", selectedReceivers);
      // console.log("updatedData", updatedData);
      // Create the payload
      const payload = {
        templateName,
        subject,
        content,
        userName,
        candidates: updatedData, // Send only the selected receivers
      };
      // console.log("payload", payload);
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${baseUrl}/api/sendMails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          setLoading(false);
          setOpen(false);
          toast.success(`Bulk Mail Sent Successfully`);
          reset();
        } else {
          setLoading(false);
          const errorData = await response.json(); // Extract response body
          if (response.status === 409) {
            toast.error(errorData.message || `Duplicate Error`);
          } else {
            toast.error(errorData.message || "Something Went Wrong");
          }
        }
      } catch (error) {
        setLoading(false);
        // console.log(error);
      }
    } catch (error) {
      alert("Error sending bulk emails");
      console.error(error);
    }
  };
  return (
    <div className="sm:col-span-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
            Send Mail
            <BottomGradient />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
          <DialogHeader className="flex flex-col items-center justify-between gap-2">
            <DialogTitle className="">Sending the Mail To: </DialogTitle>
            <br />
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col gap-8">
              <label
                className="text-lg font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                name="receiverName"
                htmlFor="receiverName"
              >
                {/* <select className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-black dark:text-white  rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
                  <option value="">-- Select --</option>
                  {data.length ? (
                    data.map((dataItem) => (
                      <option key={dataItem.id} value={dataItem.id}>
                        {dataItem.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No Receiver available</option>
                  )}
                </select> */}

                <div className="">
                  {data.length ? (
                    data.map((dataItem) => (
                      <div
                        key={dataItem.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id={`receiver-${dataItem.id}`}
                          checked={selectedReceivers.includes(dataItem.id)}
                          onChange={() => handleCheckboxChange(dataItem.id)}
                        />
                        <label htmlFor={`receiver-${dataItem.id}`}>
                          {dataItem.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>No Receiver available</p>
                  )}
                </div>
              </label>

              {loading ? (
                <button
                  disabled
                  type="button"
                  className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Sending Mail
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSendEmails}
                  className={`bg-gradient-to-br relative group/btn ${
                    data.length === 0
                      ? "opacity-500 cursor-not-allowed from-blue-700 dark:from-blue-600 dark:to-blue-200 to-blue-900"
                      : "from-blue-700 dark:from-blue-600 dark:to-blue-200 to-blue-900"
                  } block dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]`}
                  disabled={data.length === 0}
                >
                  Send Mail
                  <BottomGradient />
                </button>
              )}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

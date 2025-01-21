"use client";
import SelectInputThree from "@/components/FormInputs/SelectInputThree";
import { BottomGradient } from "@/components/ui/BottomGradient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { makePostRequest } from "@/lib/apiRequest";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
export default function ConsultantAssignment({ consultant }) {
  // console.log("name", consultant);
  const [sectorsData, setSectorsData] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");
  const [displaySectors, setDisplaySectors] = useState(
    consultant?.assignedSectors || []
  );
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [displayDomains, setDisplayDomains] = useState(
    consultant?.assignedDomains || []
  );
  const [domainOptions, setDomainOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...(consultant || {}),
      isActive: true,
    },
  });

  // Fetch sectors and domains on component mount
  useEffect(() => {
    async function fetchSectors() {
      const response = await fetch("/api/sectors");
      const data = await response.json();
      setSectorsData(data);
    }
    fetchSectors();
  }, [consultant]);

  const handleSectorChange = (event) => {
    const selectedSectorId = event.target.value;
    setSelectedSector(selectedSectorId);
    // Ensure domain selection resets if sector changes
    setSelectedDomains([]);

    // Find domains for the selected sector
    const sector = sectorsData.find((s) => s.id === selectedSectorId);
    // setSectorName(sector?.sectorName);
    setDomainOptions(sector ? sector.domains : []);
  };

  const handleRemoveSector = (sectorId) => {
    setDisplaySectors((prev) => {
      // Remove the sector by filtering out the one matching the ID
      const updatedSectors = prev.filter((sector) => sector.id !== sectorId);
      setSelectedDomains([]); // Reset domains when a sector is removed
      return updatedSectors; // Return the updated list of sectors
    });
  };
  // Remove domain from the display list
  const handleRemoveDomain = (domainId) => {
    // Step 1: Find the domain that is being removed and its associated sectorId
    const domainToRemove = sectorsData.flatMap((sector) =>
      sector.domains.filter((domain) => domain.id === domainId)
    )[0];
    console.log("domaintoremove", domainToRemove);

    // If no domain is found, return early (safety check)
    if (!domainToRemove) return;

    const sectorId = domainToRemove.sectorId;
    console.log("sectorId", sectorId);

    // Step 2: Remove the domain from displayDomains
    setDisplayDomains((prevDomains) => {
      const updatedDomains = prevDomains.filter(
        (prevDomain) => prevDomain.id !== domainId
      );
      console.log("updatedDomains", updatedDomains);

      // Step 3: Check if any domains from the same sector are still present in updatedDomains
      const sectorHasRemainingDomains = sectorsData.some((sector) => {
        if (sector.id === sectorId) {
          // Check if any remaining domains from this sector are still in updatedDomains
          return sector.domains.some((domain) =>
            updatedDomains.some(
              (updatedDomain) => updatedDomain.id === domain.id
            )
          );
        }
        return false;
      });

      // Step 4: If no domains from this sector remain, remove the sector from displaySectors
      if (!sectorHasRemainingDomains) {
        setDisplaySectors((prevSectors) =>
          prevSectors.filter((sector) => sector.id !== sectorId)
        );
      }

      return updatedDomains;
    });
  };

  console.log("displaysectors", displaySectors);
  console.log("displaydomains", displayDomains);

  const onSubmit = async (data) => {
    try {
      const payload = {
        sector: selectedSector,
        domains: selectedDomains, // Pass multiple domain IDs as an array
        consultant: consultant?.id,
      };
      console.log("payload", payload);
      const finalSectors = Array.from(
        new Set([selectedSector, ...displaySectors.map((s) => s.id)])
      );
      const finalDomains = Array.from(
        new Set([...selectedDomains, ...displayDomains.map((d) => d.id)])
      );

      const newPayload = {
        finalSectors,
        finalDomains,
        consultant: consultant?.id,
      };

      console.log("newPayload", newPayload);

      makePostRequest(
        setLoading,
        "api/consultants/assign",
        newPayload,
        "Assignment",
        reset
      );
      reset();
    } catch (error) {
      alert("Failed to update assignments.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-gradient-to-br relative group/btn from-black dark:from-lime-200 dark:to-lime-900 to-neutral-600 dark:bg-zinc-800 w-80 font-bold text-white dark:text-slate-900 rounded-xl h-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center gap-2">
          Manage Consultant
          <Settings2 />
          <BottomGradient />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-200  dark:bg-zinc-800 rounded-xl">
        <DialogHeader className="flex flex-col items-center justify-between gap-2">
          <DialogTitle className="">Select The Candidate Criteria</DialogTitle>
          <br />
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div>
          <div className="flex flex-col gap-8">
            <h3 className="text-xl font-bold mb-4">
              Assign Candidate Visibility for {consultant.name}
            </h3>
            <div className="flex gap-8">
              {/* Display Assigned Sectors with Cross Symbol */}
              <div>
                <h4 className="font-bold">Assigned Sectors</h4>
                {displaySectors.map((sector) => {
                  return (
                    <span
                      key={sector.id}
                      className="flex items-center gap-2 mb-2"
                    >
                      {sector?.sectorName}
                      <button
                        type="button"
                        onClick={() => handleRemoveSector(sector.id)}
                        className="text-red-500"
                      >
                        ✖
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Display Assigned Domains with Cross Symbol */}
              <div>
                <h4 className="font-bold">Assigned Domains</h4>
                {displayDomains.map((domain) => {
                  return (
                    <span
                      key={domain.id}
                      className="flex items-center gap-2 mb-2"
                    >
                      {domain?.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveDomain(domain.id)}
                        className="text-red-500"
                      >
                        ✖
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-emerald-500 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
            >
              <div className="flex flex-col gap-4 mb-8">
                <SelectInputThree
                  label="Sector"
                  name="sector"
                  register={register("sector", { required: true })} // Ensure gender is registered
                  errors={errors}
                  className="w-full"
                  options={sectorsData.map((sector) => ({
                    value: sector.id,
                    label: sector.sectorName,
                  }))}
                  onChange={handleSectorChange}
                  value={selectedSector}
                />
                <Controller
                  name="domain"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={domainOptions.map((domain) => ({
                        value: domain.id,
                        label: domain.name,
                      }))}
                      className="text-gray-900 dark:text-slate-900 dark:bg-zinc-600 bg-gray-300 hover:bg-lime-100 dark:hover:bg-slate-700"
                      classNamePrefix="react-select"
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions);
                        setSelectedDomains(
                          selectedOptions.map((option) => option.value)
                        );
                      }}
                      value={domainOptions
                        .filter((domain) => selectedDomains.includes(domain.id))
                        .map((domain) => ({
                          value: domain.id,
                          label: domain.name,
                        }))} // Fixes the issue
                    />
                  )}
                />
              </div>
              {loading ? (
                <button
                  disabled
                  type="button"
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
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
                  Assigning Data
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                >
                  Assign Candidates
                  <BottomGradient />
                </button>
              )}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

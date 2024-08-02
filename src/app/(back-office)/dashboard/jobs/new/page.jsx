import FormHeader from "@/components/backOffice/FormHeader";
import JobForm from "@/components/backOffice/forms/JobForm";

export default function NewJob() {
  return (
    <div>
      <FormHeader title="New Job" />
      <JobForm />
    </div>
  );
}

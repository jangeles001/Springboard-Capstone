import { DisplayPageHeader } from "./DisplayPageHeader";
import { DisplayPageBody } from "./DisplayPageBody";
import { DisplayPageFooter } from "./DisplayPageFooter";

export function DisplayPage({ hook, CardComponent, ResourceId, type }) { 
  const { data, isLoading, isError, error, handleDelete, publicId } = hook(ResourceId);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <DisplayPageHeader
        type={type}
        onDelete={handleDelete}

      />

      <DisplayPageBody
        isLoading={isLoading}
        isError={isError}
        error={error}
        data={data}
        CardComponent={CardComponent}
        publicId={publicId}
      />

      <DisplayPageFooter data={data} />

    </div>
  );
}
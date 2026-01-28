import { DisplayPageHeader } from "./DisplayPageHeader";
import { DisplayPageGrid } from "./DisplayPageGrid";
import { DisplayPageFooter } from "./DisplayPageFooter";

export function DisplayPage({ data, CardComponent }) { 

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <DisplayPageHeader
        title={data}
        onDelete={handleDelete}
      />

      <DisplayPageGrid
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
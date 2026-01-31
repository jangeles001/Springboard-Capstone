import { DisplayPageHeader } from "./DisplayPageHeader";
import { DisplayPageBody } from "./DisplayPageBody";
import { DisplayPageFooter } from "./DisplayPageFooter";

export function DisplayPage({ hook, CardComponent, ResourceId, type }) { 
  const { data, isLoading, isError, error, handleDelete, publicId, handleReturn, handleAddToPersonal } = hook(ResourceId);
  const isPersonal = publicId === data?.data?.creatorPublicId;

  return (
    <div className="mx-auto max-w-7xl px-6 py-22">

      <DisplayPageHeader
      type={type}
      handleReturn={handleReturn}
      handleAddToPersonal={handleAddToPersonal}
      resourceId={ResourceId}
      publicId={publicId}
      data={data}
      />

      <DisplayPageBody
      isLoading={isLoading}
      isError={isError}
      error={error}
      data={data}
      CardComponent={CardComponent}
      publicId={publicId}
      handleDelete={handleDelete}
      isPersonal={isPersonal}
      />

      <DisplayPageFooter data={data} />

    </div>
  );
}
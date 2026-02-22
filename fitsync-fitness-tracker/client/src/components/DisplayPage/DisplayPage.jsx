import { DisplayPageHeader } from "./DisplayPageHeader";
import { DisplayPageBody } from "./DisplayPageBody";
import { DisplayPageFooter } from "./DisplayPageFooter";
import Breadcrumbs from "../Breadcrumbs"

export default function DisplayPage({ hook, CardComponent, ResourceId, type }) { 
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    logIsPending, 
    handleDelete, 
    publicId, 
    handleReturn, 
    handleLog 
  } = hook(ResourceId);
  const isPersonal = publicId === data?.data?.creatorPublicId;
  const dynamicCrumb = data?.data?.uuid ?? type;
  
  return (
    <>
    <div className="font-semibold mx-auto max-w-7xl px-6 mt-5 py-5">
      <Breadcrumbs dynamicCrumb={dynamicCrumb} />
    </div>
    <div className="mx-auto max-w-7xl px-6">
      <DisplayPageHeader
      type={type}
      handleReturn={handleReturn}
      handleLog={handleLog}
      resourceId={ResourceId}
      publicId={publicId}
      logIsPending={logIsPending}
      />

      <DisplayPageBody
      isLoading={isLoading}
      isError={isError}
      error={error}
      data={data}
      CardComponent={CardComponent}
      handleDelete={handleDelete}
      isPersonal={isPersonal}
      />

      <DisplayPageFooter data={data} />

    </div>
    </>
  );
}
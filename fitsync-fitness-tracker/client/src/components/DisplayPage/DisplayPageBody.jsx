import Loading from "../Loading.jsx";

export function DisplayPageBody({
  isLoading,
  isError,
  error,
  data,
  publicId,
  CardComponent,
  handleDelete,
  isPersonal,
}) {
    if (isLoading) return <Loading type="content-only" />;
    if (isError) return (console.error(error) || <p>Error loading data.</p>);


    return (
      <CardComponent data={data} publicId={publicId} handleDelete={handleDelete} isPersonal={isPersonal} />
    );
}
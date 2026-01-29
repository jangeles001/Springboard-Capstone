import Loading from "../Loading.jsx";

export function CollectionPageGrid({
  isLoading,
  isError,
  error,
  data,
  emptyText,
  CardComponent,
  publicId,
  onClick
}) {
    if (isLoading) return <Loading type="content-only" />;
    if (isError) return (console.error(error) || <p>Error loading data.</p>);
    const items = data?.data?.meals || data?.data?.workouts || [];

    if (!items.length) {
        return (
            
            <p className="mt-25 text-center text-gray-500">
                {emptyText}
            </p>
        );
    }

    return (
        <div className="flex flex-row flex-wrap gap-20 justify-center p-0">
            {items.map((item) => (
            <CardComponent key={item.uuid || item.id} item={item} publicId={publicId} onClick={onClick} />
            ))}
        </div>
  );
}
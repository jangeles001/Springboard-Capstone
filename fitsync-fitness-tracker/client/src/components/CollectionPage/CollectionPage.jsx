import { CollectionPageHeader } from "./CollectionPageHeader";
import { CollectionPageGrid } from "./CollectionPageGrid";
import { CollectionPageFooter } from "./CollectionPageFooter";

export function CollectionPage({
  hook,
  CardComponent,
  titlePersonal,
  titleAll,
  emptyText,
}) {
  const {
    active,
    isLoading,
    isPending,
    handleActiveChange,
    handleNextPage,
    handlePreviousPage,
    onClick,
    handleDelete,
    data,
    isError,
    error,
  } = hook({ limit: 6 });

  return (
    <div className="mx-auto px-6 py-10">

      <CollectionPageHeader
        active={active}
        onChange={handleActiveChange}
        titlePersonal={titlePersonal}
        titleAll={titleAll}
        isLoading={isLoading}
      />

      <CollectionPageGrid
        active={active}
        isLoading={isLoading}
        isError={isError}
        error={error}
        data={data}
        emptyText={emptyText}
        CardComponent={CardComponent}
        onClick={onClick}
        handleDelete={handleDelete}
        isPending={isPending}
      />

      <CollectionPageFooter data={data} next={handleNextPage} previous={handlePreviousPage}/>

    </div>
  );
}
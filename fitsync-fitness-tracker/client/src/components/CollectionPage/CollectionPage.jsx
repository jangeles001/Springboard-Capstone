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
    publicId,
    isLoading,
    handleActiveChange,
    data,
    isError,
    error,
  } = hook({ limit: 12 });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <CollectionPageHeader
        active={active}
        onChange={handleActiveChange}
        titlePersonal={titlePersonal}
        titleAll={titleAll}
        isLoading={isLoading}
      />

      <CollectionPageGrid
        isLoading={isLoading}
        isError={isError}
        error={error}
        data={data}
        emptyText={emptyText}
        CardComponent={CardComponent}
        publicId={publicId}
      />

      <CollectionPageFooter data={data} />

    </div>
  );
}
import { CollectionPageHeader } from "./CollectionPageHeader";
import { CollectionPageGrid } from "./CollectionPageGrid";
import { CollectionPageFooter } from "./CollectionPageFooter";
import { useRouter } from "@tanstack/react-router";

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
    mealClick,
    data,
    isError,
    error,
  } = hook({ limit: 12 });

  const router = useRouter();
  console.log("Current route:", router.state.location.pathname);

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
        onClick={mealClick}
      />

      <CollectionPageFooter data={data} />

    </div>
  );
}
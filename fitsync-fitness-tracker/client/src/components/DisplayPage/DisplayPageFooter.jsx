export function CollectionPageFooter({ data }) {
  return (
    <div className="mt-10 flex justify-center gap-6">
      {data?.data?.previousPage && (
        <button className="text-sm font-medium hover:underline">
          Prev
        </button>
      )}

      {data?.data?.nextPage && (
        <button className="text-sm font-medium hover:underline">
          Next
        </button>
      )}
    </div>
  );
}
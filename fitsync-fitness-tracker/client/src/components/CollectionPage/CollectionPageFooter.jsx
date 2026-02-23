export function CollectionPageFooter({ data, next, previous }) {
  return (
    <div className="mt-10 flex justify-center gap-6">
      {data?.data?.hasPreviousPage && (
        <button 
        className="text-sm font-medium hover:underline hover:cursor-pointer"
        onClick={previous}
        >
          Prev
        </button>
      )}

      {data?.data?.hasNextPage && (
        <button
        className="text-sm font-medium hover:underline hover:cursor-pointer"
        onClick={next}
        >
          Next
        </button>
      )}
    </div>
  );
}
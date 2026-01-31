export function DisplayPageFooter({ data }) {
  return (
    <div className="mt-10 flex w-max mx-auto text-gray-500">
      <p>Created by: {data?.data?.creatorPublicId || "Unknown"}</p>
    </div>
  );
}
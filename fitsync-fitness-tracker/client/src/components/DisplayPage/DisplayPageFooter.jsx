export function DisplayPageFooter({ data }) {
  return (
    <div className="mt-10 flex justify-center text-gray-500">
      <p>Created by: {data?.data?.creatorPublicId || "Unknown"}</p>
    </div>
  );
}
import { useUserProfile } from "../hooks/useUserProfile.js";

export default function ProfileBlock() {
  const { username, publicId } = useUserProfile();

  return (
    <div className="flex flex-col border rounded shadow-sm ml-auto px-3 py-2 max-w-max overflow-hidden bg-white">
      <p className="text-sm truncate">
        <span className="font-semibold">User:</span> {username}
      </p>
      <p className="text-xs text-gray-500 truncate">
        PublicId: {publicId}
      </p>
    </div>
  );
}
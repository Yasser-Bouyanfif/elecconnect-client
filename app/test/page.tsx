"use client";

import { useUser } from "@clerk/nextjs";

export default function AddAddress() {
  const { user } = useUser();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address = formData.get("address") as string;

    await user?.update({
      unsafeMetadata: {
        address: address,
      },
    });

    alert("Adresse enregistrée !");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="address"
        placeholder="Votre adresse"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Enregistrer
      </button>
    </form>
  );
}


//    console.log("public:", user?.publicMetadata);

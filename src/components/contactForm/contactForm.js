import { useState } from "react";
import { Listbox } from "@headlessui/react";
import {
  Person as UserIcon,
  Business as OfficeBuildingIcon,
  Work as BriefcaseIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Language as GlobeAltIcon,
  Lock as KeyIcon,
} from "@mui/icons-material";

export default function AddContact({ onAddContact }) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    status: "Client", // Valeur par défaut
    email: "",
    website: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const statusOptions = ["Client", "Fournisseur", "Partenaire"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout du contact.");

      const data = await res.json();

      if (data.success) {
        onAddContact(data.contact);
        setFormData({
          name: "",
          company: "",
          role: "",
          status: "Client",
          email: "",
          website: "",
          phone: "",
        });
        alert("Contact ajouté avec succès !");
      } else throw new Error(data.message || "Erreur inconnue.");
    } catch (error) {
      console.error("Erreur :", error);
      alert(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-pink-600 hover:shadow-blue-200 transition-shadow duration-300"
        >
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Ajouter un Contact
          </h2>

          {[
            { name: "name", placeholder: "Nom complet", icon: <UserIcon /> },
            { name: "company", placeholder: "Entreprise", icon: <OfficeBuildingIcon /> },
            { name: "role", placeholder: "Rôle", icon: <BriefcaseIcon /> },
            { name: "email", placeholder: "Email", type: "email", icon: <MailIcon /> },
            { name: "phone", placeholder: "Téléphone", icon: <PhoneIcon /> },
            { name: "website", placeholder: "Site web", type: "url", icon: <GlobeAltIcon /> },
          ].map((field, index) => (
            <div key={index} className="flex items-center mb-4 space-x-4">
              <div className="text-gray-500">{field.icon}</div>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full pl-2 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required={field.name === "name" || field.name === "email"}
              />
            </div>
          ))}

          {/* Composant Listbox pour le statut */}
          <div className="flex items-center mb-4 space-x-4">
            <div className="text-gray-500"><KeyIcon /></div>
            <Listbox
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
            >
              <Listbox.Button className="w-full pl-2 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white flex justify-between items-center">
                <span>{formData.status}</span>
                <svg
                  className="w-5 h-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-1/2">
                {statusOptions.map((status) => (
                  <Listbox.Option
                    key={status}
                    value={status}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-2 pl-2 pr-4  ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {status}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-blue-600"
                            }`}
                          >
                            <svg
                              className="w-5 h-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 p-3 text-white font-semibold rounded-lg transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Chargement..." : "Ajouter le contact"}
          </button>
        </form>

        {/* Section Vidéo */}
        <div className="hidden lg:block relative w-full h-full overflow-hidden rounded-2xl shadow-lg">
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video/bg-2.mp4" type="video/mp4" />
            Votre navigateur ne prend pas en charge la vidéo.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}

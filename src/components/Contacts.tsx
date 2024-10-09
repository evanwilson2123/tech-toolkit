import React, { useState } from "react";
import { FaPlus, FaEllipsisV } from "react-icons/fa";

interface Contact {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      firstName: "John",
      lastName: "Doe",
      phone: "123-456-7890",
      email: "john.doe@example.com",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      phone: "987-654-3210",
      email: "jane.smith@example.com",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState<Contact>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [showOptions, setShowOptions] = useState<number | null>(null); // Track which contact's options are open

  const addContact = () => {
    if (
      newContact.firstName &&
      newContact.lastName &&
      newContact.phone &&
      newContact.email
    ) {
      setContacts([...contacts, newContact]);
      setNewContact({ firstName: "", lastName: "", phone: "", email: "" });
      setShowForm(false); // Hide form after adding
    }
  };

  const deleteContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
    setShowOptions(null); // Hide options after deletion
  };

  return (
    <div className="flex-grow p-4 bg-gray-800 rounded shadow-md transition-all hover:shadow-lg relative">
      <h2 className="text-xl font-semibold mb-4 text-techAccent">Contacts</h2>

      {/* "+" Button to show the form */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="absolute top-4 right-4 bg-techButton text-white p-2 rounded-full hover:bg-blue-500 transition-all"
      >
        <FaPlus />
      </button>

      {/* Expandable Form to Add Contact */}
      {showForm && (
        <div className="p-4 bg-gray-900 rounded-lg mb-4 transition-all space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newContact.firstName}
              onChange={(e) =>
                setNewContact({ ...newContact, firstName: e.target.value })
              }
              placeholder="First Name"
              className="w-full bg-gray-700 p-2 rounded border border-techAccent focus:border-techButton focus:outline-none"
            />
            <input
              type="text"
              value={newContact.lastName}
              onChange={(e) =>
                setNewContact({ ...newContact, lastName: e.target.value })
              }
              placeholder="Last Name"
              className="w-full bg-gray-700 p-2 rounded border border-techAccent focus:border-techButton focus:outline-none"
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newContact.phone}
              onChange={(e) =>
                setNewContact({ ...newContact, phone: e.target.value })
              }
              placeholder="Phone Number"
              className="w-full bg-gray-700 p-2 rounded border border-techAccent focus:border-techButton focus:outline-none"
            />
            <input
              type="email"
              value={newContact.email}
              onChange={(e) =>
                setNewContact({ ...newContact, email: e.target.value })
              }
              placeholder="Email"
              className="w-full bg-gray-700 p-2 rounded border border-techAccent focus:border-techButton focus:outline-none"
            />
          </div>
          <button
            onClick={addContact}
            className="bg-techButton text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all"
          >
            Add Contact
          </button>
        </div>
      )}

      {/* Contact List */}
      <ul className="space-y-2">
        {contacts.map((contact, index) => (
          <li
            key={index}
            className="p-4 bg-gray-700 rounded flex justify-between items-center transition-all relative"
          >
            <div>
              <p className="font-semibold">{`${contact.firstName} ${contact.lastName}`}</p>
              <p className="text-sm text-gray-300">{contact.phone}</p>
              <p className="text-sm text-gray-300">{contact.email}</p>
            </div>
            {/* Three-dot menu for options */}
            <button
              onClick={() =>
                setShowOptions(showOptions === index ? null : index)
              }
              className="text-white p-2 rounded-full hover:bg-gray-600 transition-all"
            >
              <FaEllipsisV />
            </button>

            {/* Dropdown menu for options (delete) */}
            {showOptions === index && (
              <div className="absolute top-10 right-8 bg-gray-800 p-2 rounded shadow-lg z-10">
                <button
                  onClick={() => deleteContact(index)}
                  className="text-red-500 px-4 py-2 rounded hover:bg-gray-700 transition-all"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;

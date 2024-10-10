import React, { useState, useEffect } from "react";
import { FaPlus, FaEllipsisV } from "react-icons/fa";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNum: string;
  email: string;
}

interface ContactsProps {
  currentToolkit: string;
  toolkitId: string;
  currentToolkitContacts: string[]; // This should be an array of contact IDs
}

const Contacts: React.FC<ContactsProps> = ({
  currentToolkit,
  toolkitId,
  currentToolkitContacts,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]); // Initialize contacts as an empty array
  const [newContact, setNewContact] = useState<Contact>({
    _id: "",
    firstName: "",
    lastName: "",
    phoneNum: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showOptions, setShowOptions] = useState<number | null>(null); // Track which contact's options are open
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch contacts when the currentToolkitContacts prop changes (this assumes currentToolkitContacts is an array of contact IDs)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (currentToolkitContacts && currentToolkitContacts.length > 0) {
          // Fetch contacts by their IDs
          const response = await fetch(
            `/api/contact?contactIds=${currentToolkitContacts.join(",")}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch contacts.");
          }

          const fetchedContacts = await response.json();

          // Map phoneNum to phone for consistent display
          const normalizedContacts = fetchedContacts.contacts.map(
            (contact: Contact) => ({
              ...contact,
              firstName: contact.firstName || "", // Default to empty string if undefined
              lastName: contact.lastName || "", // Default to empty string if undefined
              phoneNum: contact.phoneNum || "", // Default to empty string if undefined
              email: contact.email || "", // Default to empty string if undefined
            })
          );

          setContacts(normalizedContacts);
        } else {
          setContacts([]); // Clear contacts if none are available
        }
      } catch (error: any) {
        console.error("Error fetching contacts:", error);
        setStatusMessage("Failed to fetch contacts.");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    };

    fetchContacts();
  }, [currentToolkitContacts]);

  const addContact = async () => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact: newContact, toolkitId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add contact.");
      }

      const createdContact = await response.json(); // Assuming the API returns the newly created contact
      setContacts([...contacts, createdContact.contact]); // Add the new contact to the list
      setNewContact({
        _id: "",
        firstName: "",
        lastName: "",
        phoneNum: "",
        email: "",
      });
      setShowForm(false); // Hide form after adding
      setStatusMessage("Contact added successfully!");

      // Clear message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Error adding contact:", error);
      setStatusMessage("Failed to add contact.");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const deleteContact = async (index: number) => {
    const contactToDelete = contacts[index];
    try {
      const response = await fetch("/api/contact", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactId: contactToDelete._id, toolkitId }), // Assuming contacts have _id
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact.");
      }

      setContacts(contacts.filter((_, i) => i !== index));
      setShowOptions(null); // Hide options after deletion
      setStatusMessage("Contact deleted successfully!");

      // Clear message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      setStatusMessage("Failed to delete contact.");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="flex-grow p-4 bg-gray-800 rounded shadow-md transition-all hover:shadow-lg relative">
      <h2 className="text-xl font-semibold mb-4 text-techAccent">
        Contacts - {currentToolkit}
      </h2>

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
              value={newContact.phoneNum} // Adjusted field
              onChange={(e) =>
                setNewContact({ ...newContact, phoneNum: e.target.value })
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
        {contacts && contacts.length > 0 ? (
          contacts.map((contact, index) => (
            <li
              key={index}
              className="p-4 bg-gray-700 rounded flex justify-between items-center transition-all relative"
            >
              <div>
                <p className="font-semibold">{`${contact.firstName} ${contact.lastName}`}</p>
                <p className="text-sm text-gray-300">{contact.phoneNum}</p>{" "}
                {/* Display phoneNum */}
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
          ))
        ) : (
          <p>No contacts available.</p>
        )}
      </ul>

      {/* Status Message */}
      {statusMessage && (
        <div className="p-2 bg-gray-900 text-center text-white font-semibold mt-2 rounded shadow-md">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default Contacts;

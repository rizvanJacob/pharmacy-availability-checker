import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import MedicineCard from "./MedicineCard";
import PharmacistCard from "./PharmacistCard";

export default function Bookmarks({ setPage }) {
  const [consumer, setConsumer] = useState(null);
  const [bookmarkedMedicines, setBookmarkedMedicines] = useState([]);
  const [bookmarkedPharmacists, setBookmarkedPharmacists] = useState([]);
  const [showMedicines, setShowMedicines] = useState(false);
  const [showPharmacists, setShowPharmacists] = useState(false);

  useEffect(() => {
    setPage();

    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token) {
      const decodedToken = jwt_decode(token);
      console.log("decodedToken: ", decodedToken);
      async function fetchConsumerData() {
        const response = await fetch(
          `/api/consumers/${decodedToken.accountId}`
        );
        console.log("Response: ", response);
        const data = await response.json();
        console.log("Consumer: ", data);
        setConsumer(data);
      }
      fetchConsumerData();
    }
  }, []);

  useEffect(() => {
    if (consumer) {
      async function fetchData() {
        // Fetch the data for the bookmarked medicines
        const medicineResponses = await Promise.all(
          consumer.bookmarkedMedicines.map(async (medicineId) => {
            const response = await fetch(`/api/medicines/${medicineId}`);
            const data = await response.json();
            return data;
          })
        );
        setBookmarkedMedicines(medicineResponses);

        // Fetch the data for the bookmarked pharmacists
        const pharmacistResponses = await Promise.all(
          consumer.bookmarkedPharmacists.map(async (pharmacistId) => {
            const response = await fetch(`/api/pharmacists/${pharmacistId}`);
            const data = await response.json();
            return data;
          })
        );
        setBookmarkedPharmacists(pharmacistResponses);
      }
      fetchData();
    }
  }, [consumer]);

  const handleMedicinesClick = () => {
    setShowMedicines(true);
    setShowPharmacists(false);
  };

  const handlePharmacistsClick = () => {
    setShowMedicines(false);
    setShowPharmacists(true);
  };

  return (
    <div>
      <div className="container mx-0 flex min-w-full items-center justify-around">
        <button onClick={handleMedicinesClick} className="mt-10">
          Medicines
        </button>
        <button onClick={handlePharmacistsClick} className="mt-10">
          Pharmacists
        </button>
      </div>

      {showMedicines && (
        <div className="ml-2 divide-y divide-solid">
          {/* <h2>Bookmarked Medicines</h2> */}
          {bookmarkedMedicines.map((medicine) => (
            <div className="my-4" key={medicine._id}>
              <h3 className="font-bold">{medicine.name}</h3>
              <MedicineCard medicine={medicine} />
            </div>
          ))}
        </div>
      )}

      {showPharmacists && (
        <div>
          <h2>Bookmarked Pharmacists</h2>
          {bookmarkedPharmacists.map((pharmacist) => (
            <div key={pharmacist._id}>
              <h3>Pharmacist ID: {pharmacist._id}</h3>
              <PharmacistCard pharmacist={pharmacist} />
            </div>
          ))}
        </div>
      )}

      {/* <h2 className="mt-2">Consumer Details</h2>
      {consumer ? (
        <>
          <p>Email: {consumer.email}</p>

          <h3>Bookmarked Medicines</h3>
          <ul>
            {bookmarkedMedicines.map((medicine) => (
              <li key={medicine._id}>{medicine.name}</li>
            ))}
          </ul>

          <h3>Bookmarked Pharmacists</h3>
          <ul>
            {bookmarkedPharmacists.map((pharmacist) => (
              <li key={pharmacist._id}>{pharmacist.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>No consumer data found.</p>
      )} */}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import RoomCard from "./RoomCard";
import { baseurl } from "../services/Baseurl";

const FeatureRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchrooms = async () => {
    try {
      const res = await fetch(`${baseurl}/all-rooms`);

      if (!res.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await res.json();

      setRooms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchrooms();
  }, []);
  if (loading) {
    return <Loading />;
  }
  console.log(rooms);
  return (
    <div className="py-10">
      <div className="grid grid-cols-3 gap-2">
        {
        rooms.slice(0,3).map((room, id) => (
          <RoomCard room={room} key={id} />
        ))
        }
      </div>
    </div>
  );
};

export default FeatureRooms;

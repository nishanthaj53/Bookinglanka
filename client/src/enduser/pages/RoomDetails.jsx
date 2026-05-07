import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import apiClient from "../../services/apiClient";
import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import RoomDetailViewCore from "../../components/room/RoomDetailViewCore";

export default function RoomDetails() {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomsCount, setRoomsCount] = useState(1);
  const [guests, setGuests] = useState(2);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/hotels/${hotelId}`);
        const h = res.data;
        const r = (h.rooms || []).find((x) => x.id === roomId);
        if (!r) {
          setError("Room not found at this hotel.");
          setHotel(null);
          setRoom(null);
        } else {
          setHotel(h);
          setRoom(r);
        }
      } catch (e) {
        setError(e.response?.data?.error || e.message || "Failed to load");
        setHotel(null);
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [hotelId, roomId]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    if (!room) return 0;
    return room.pricePerNight * Math.max(roomsCount, 1) * Math.max(nights, 1);
  }, [room, roomsCount, nights]);

  const handleBookNow = async (e) => {
    e.preventDefault();
    if (!room?.id) return;
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    if (!token) {
      navigate(`/login?redirect=/hotels/${hotelId}/room/${roomId}`);
      return;
    }
    try {
      await apiClient.post("/bookings", {
        hotelId,
        roomTypeId: room.id,
        checkIn,
        checkOut,
        currency: "USD",
        guests,
        rooms: roomsCount,
      });
      alert("Room booking created successfully.");
      navigate("/dashboard/bookings");
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading room…</p>;
  if (error || !hotel || !room) {
    return (
      <Layout>
        <TopbarOne />
        <HeaderTwo />
        <HeaderTwoCloned />
        <section className="tour-listing-details section-space" style={{ padding: "3rem 1rem" }}>
          <Container>
            <p style={{ color: "#c00" }}>{error || "Not found."}</p>
            <Link to={`/hotels/${hotelId}`}>← Back to hotel</Link>
          </Container>
        </section>
        <FooterOne />
      </Layout>
    );
  }

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />

      <RoomDetailViewCore
        hotel={hotel}
        room={room}
        hotelId={hotelId}
        otherRooms={(hotel.rooms || []).filter((x) => x.id !== roomId)}
        showBookForm
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        guests={guests}
        setGuests={setGuests}
        roomsCount={roomsCount}
        setRoomsCount={setRoomsCount}
        nights={nights}
        totalPrice={totalPrice}
        onBookSubmit={handleBookNow}
      />

      <FooterOne />
    </Layout>
  );
}

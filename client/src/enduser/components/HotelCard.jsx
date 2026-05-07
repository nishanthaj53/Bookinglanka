import { Link } from 'react-router-dom'

export default function HotelCard({ hotel }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', width: '280px' }}>
      <img
        src={hotel.coverImage || 'https://via.placeholder.com/280x150'}
        alt={hotel.name}
        style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '0.5rem' }}
      />
      <h3>{hotel.name}</h3>
      <p>{hotel.address}</p>
      <p>Capacity: {hotel.minCapacity} – {hotel.maxCapacity}</p>
      <p>Price: ${hotel.minPrice} – ${hotel.maxPrice}</p>
      <Link to={`/hotels/${hotel.id}`}>View Details</Link>
    </div>
  )
}

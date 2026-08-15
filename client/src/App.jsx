import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= USER PAGES ================= */
import HotelsList from "./enduser/pages/HotelsList";
import HotelDetails from "./enduser/pages/HotelDetails";
import RoomDetails from "./enduser/pages/RoomDetails";
import Login from "./enduser/pages/Login";
import Signup from "./enduser/pages/Signup";
import Dashboard from "./enduser/pages/Dashboard";
import DashboardHotels from "./enduser/pages/DashboardHotels";
import DashboardFavouriteDestination from "./enduser/pages/DashboardFavouriteDestination";
import DashboardBookings from "./enduser/pages/DashboardBookings";
import DashboardBookingsCart from "./enduser/pages/DashboardBookingsCart";
import DashboardHotelRooms from "./enduser/pages/DashboardHotelRooms";
import ProtectedUserRoute from "./enduser/pages/ProtectedRoute";// ✅ FIXED
import AboutPage from "./enduser/pages/About";
import LoginDesign from "./enduser/pages/LoginDesign"; 
import SignupDesign from "./enduser/pages/SignupDesign";
import ResetPasswordPage from "./enduser/pages/ResetPasswordPage";
import ForgotPasswordPage from "./enduser/pages/ForgotPasswordPage";
import VerifyEmailPage from "./enduser/pages/VerifyEmailPage";
import Contact from "./enduser/pages/Contact";
import AccountEntry from "./enduser/pages/AccountEntry";
import DestinationDetailsPage from "./enduser/pages/DestinationDetailsPage";
import DestinationsPage from "./enduser/pages/DestinationsPage";
import PropertyPage from "./enduser/pages/PropertyPage";
import PropertyDetailsPage from "./enduser/pages/PropertyDetailsPage";
import AiPlannerPage from "./enduser/pages/AiPlannerPage";
// import Hoteldetailui from "./enduser/pages/HotelDetailUiPage";  

// import DestinationDetailTrinco from "./enduser/pages/DestinationDetail"


/* ================= MANAGER PAGES ================= */
import ManagerLogin from "./manager/pages/ManagerLogin";
import ManagerSignup from "./manager/pages/ManagerSignup";
import ManagerDashboard from "./manager/pages/ManagerDashboard";
import ManagerHotels from "./manager/pages/ManagerHotels";
import ManagerHotelCreate from "./manager/pages/ManagerHotelCreate";
import ManagerHotelEdit from "./manager/pages/ManagerHotelEdit";
import ManagerRooms from "./manager/pages/ManagerRooms";
import ManagerRoomView from "./manager/pages/ManagerRoomView";
import ManagerBookings from "./manager/pages/ManagerBookings";
import ManagerIncome from "./manager/pages/ManagerIncome";
import ManagerPayoutAccount from "./manager/pages/ManagerPayoutAccount";
import ProtectedManagerRoute from "./manager/pages/ManagerProtectedRoute";

/* ================= ADMIN PAGES ================= */
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ProtectedAdminRoute from "./admin/pages/ProtectedAdminRoute";
import AdminHotels from "./admin/pages/AdminHotels";
import AdminBookings from "./admin/pages/AdminBookings";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminRevenue from "./admin/pages/AdminRevenue";
import AdminDestinations from "./admin/pages/AdminDestinations";
import AdminCommission from "./admin/pages/AdminCommission";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========== PUBLIC USER ROUTES ========== */}
        <Route path="/" element={<HotelsList />} />
        <Route path="/hotels/:hotelId/room/:roomId" element={<RoomDetails />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        {/* <Route path="/login" element={<Login />} />          /*the login page before ui Design*/ }
        {/* <Route path="/signup" element={<Signup />} />        /*the signup page before ui Design*/}
        <Route path="/about" element={<AboutPage />} />       
        <Route path="/login" element={<LoginDesign />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/account" element={<AccountEntry />} />
        <Route path="/signup" element={<SignupDesign />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route path="/property" element={<PropertyPage />} />
        <Route path="/ai-planner" element={<AiPlannerPage />} />
        <Route path="/destinations/:slug" element={<DestinationDetailsPage />} />
        <Route path="/destinationkandy" element={<Navigate to="/destinations/kandy" replace />} />
        <Route path="/destinationGalle" element={<Navigate to="/destinations/galle" replace />} />
        <Route path="/destinationElla" element={<Navigate to="/destinations/ella" replace />} />
        <Route path="/destinationArugampe" element={<Navigate to="/destinations/arugam-bay" replace />} />
        <Route path="/destinationSigiriya" element={<Navigate to="/destinations/sigiriya" replace />} />
        {/* <Route path="/hoteldetailui" element={<Hoteldetailui />} /> */}


        {/* ========== USER DASHBOARD (PROTECTED) ========== */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedUserRoute>
              <Dashboard />
            </ProtectedUserRoute>
          }
        >
          <Route path="hotels" element={<DashboardHotels />} />
          <Route path="favourite-destination" element={<DashboardFavouriteDestination />} />
          <Route path="bookings" element={<DashboardBookings />} />
          <Route path="bookings/cart" element={<DashboardBookingsCart />} />
          <Route path="hotels/:id" element={<DashboardHotelRooms />} />
          <Route index element={<DashboardHotels />} />
        </Route>

        {/* ========== MANAGER PUBLIC ROUTES ========== */}
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/signup" element={<ManagerSignup />} />

        {/* ========== MANAGER DASHBOARD (PROTECTED) ========== */}
        <Route
          path="/manager/dashboard/*"
          element={
            <ProtectedManagerRoute>
              <ManagerDashboard />
            </ProtectedManagerRoute>
          }
        >
          <Route index element={<Navigate to="hotels/active" replace />} />
          <Route path="bookings" element={<ManagerBookings />} />
          <Route path="income" element={<ManagerIncome />} />
          <Route path="payout-account" element={<ManagerPayoutAccount />} />
          <Route path="hotels" element={<Navigate to="/manager/dashboard/hotels/active" replace />} />
          <Route path="hotels/active" element={<ManagerHotels statusFilter="ACTIVE" />} />
          <Route path="hotels/inactive" element={<ManagerHotels statusFilter="DRAFT" />} />
          <Route path="hotels/new" element={<ManagerHotelCreate />} />
          <Route path="hotels/:hotelId/rooms/:roomId" element={<ManagerRoomView />} />
          <Route path="hotels/:hotelId/rooms" element={<ManagerRooms />} />
          <Route path="hotels/:hotelId/edit" element={<ManagerHotelEdit />} />
          {/* Same hotel hub as /rooms — URL stays /hotels/:hotelId for managers */}
          <Route path="hotels/:hotelId" element={<ManagerRooms />} />
        </Route>

        {/* ========== ADMIN PUBLIC ROUTE ========== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ========== ADMIN DASHBOARD (PROTECTED) ========== */}
        <Route
          path="/admin/dashboard/*"
          element={ 
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        >
          <Route path="hotels" element={<Navigate to="/admin/dashboard/hotels/active" replace />} />
          <Route path="hotels/active" element={<AdminHotels statusFilter="ACTIVE" />} />
          <Route path="hotels/draft" element={<AdminHotels statusFilter="DRAFT" />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<Navigate to="/admin/dashboard/members/users" replace />} />
          <Route path="members/users" element={<AdminUsers accountKind="guest" />} />
          <Route path="members/managers" element={<AdminUsers accountKind="manager" />} />
          <Route path="revenue" element={<AdminRevenue />} />
          <Route path="destinations" element={<AdminDestinations />} />
          <Route path="commission" element={<AdminCommission />} />
          <Route index element={<Navigate to="/admin/dashboard/hotels/active" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

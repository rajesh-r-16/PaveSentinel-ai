
import Navbar from "../components/dashboard/Navbar";
import Footer from "../components/dashboard/Footer";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-transparent">

      

      <div className="flex-1 ml-72">

        <Navbar />

        <main className="p-8 bg-transparent">

          {children}

        </main>

        <Footer />

      </div>

    </div>
  );
};

export default DashboardLayout;
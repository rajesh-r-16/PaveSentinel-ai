

import Navbar from "./Navbar";
import Footer from "./Footer";

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
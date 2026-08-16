
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = ({ children }) => {

  return (

    <div className="flex bg-transparent min-h-screen">

      

      <div className="ml-64 flex-1">

        <Navbar />

        <main className="p-8 bg-transparent">

          {children}

        </main>

        <Footer />

      </div>

    </div>

  );

};

export default MainLayout;

import StatCard from "../../components/dashboard/StatCard";

import {
    Road,
    Clock3,
    CircleCheck,
    Wrench,
    CheckCheck
} from "lucide-react";
import ReportForm from "../../components/dashboard/ReportForm";
import RecentReports from "../../components/dashboard/RecentReports";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCitizenDashboardStats } from "../../services/reportService";

import ReportMap from "../../components/map/ReportMap";
import AIResultCard from "../../components/ai/AIResultCard";
import StatusChart from "../../components/analytics/StatusChart";

import SeverityChart from "../../components/analytics/SeverityChart";
import {
    getMapReports,
    getMyReports,
    searchReports,
    getDashboardAnalytics
} from "../../services/reportService";
import { logoutUser } from "../../utils/auth";
import citizenBg from "../../assets/backgrounds/citizen-bg.jpg";
import CitizenSidebar from "./CitizenSidebar";
import RoadReportAnalytics from "../../components/analytics/RoadReportAnalytics";
const Dashboard = () => {
  const navigate = useNavigate();
  const [reports,setReports]=useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResult,setAiResult]=useState(null);
  const [address,setAddress]=useState("");
  const [error, setError] = useState("");

  const [status,setStatus]=useState("");

  const [severity,setSeverity]=useState("");

  const [priority,setPriority]=useState("");

  
  const [analytics, setAnalytics] = useState(null);
  const [userName, setUserName] = useState("Citizen");
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);

                setUserName(
                    user.name ||
                    user.full_name ||
                    user.username ||
                    user.email?.split("@")[0] ||
                    "Citizen"
                );
            } catch (error) {
                console.error("Error reading user data:", error);
            }
        }
    }, []);
  const logout = () => {
    localStorage.clear();
    navigate("/login",{
      replace: true
    });
  };



  const [stats, setStats] = useState({
    total_reports: 0,
    pending: 0,
    verified: 0,
    in_progress: 0,
    completed: 0
  });

  const loadReports = async () => {
    try {
        const data = await getMyReports();

        setReports(data);
    } catch (error) {
        console.error("Failed to load reports:", error);

        setError(
            error.response?.data?.detail ||
            "Failed to load reports"
        );
    }
  };

  const loadStats = async () => {
    try {
        const data = await getCitizenDashboardStats();

        console.log("========== CITIZEN STATS ==========");
        console.log(data);
        console.log("total_reports:", data.total_reports);
        console.log("total:", data.total);
        console.log("pending:", data.pending);
        console.log("verified:", data.verified);
        console.log("in_progress:", data.in_progress);
        console.log("completed:", data.completed);
        console.log("accuracy:", data.accuracy);
        console.log("====================================");

        setStats(data);

    } catch (error) {

        console.error(
            "Failed to load dashboard stats:",
            error
        );

    }
  };

  useEffect(() => {

        const loadDashboard = async () => {

            setLoading(true);

            await Promise.all([
                loadReports(),
                loadStats(),
                loadMap(),
                loadAnalytics()
            ]);

            setLoading(false);

        };

        loadDashboard();

    }, []);
  const loadMap = async()=>{

    try{

        const data=await getMapReports();

        setReports(data);

    }

    catch(error){

        console.log(error);

    }

  }
  const loadFilteredReports = async () => {

    try {

        setLoading(true);

        const data = await searchReports({

            address: address || undefined,

            status: status || undefined,

            severity: severity || undefined,

            priority: priority || undefined

        });

        setReports(data);

    } catch (error) {

        console.error(
            "Search reports error:",
            error
        );

    } finally {

        setLoading(false);

    }

  };
  const loadAnalytics = async () => {

    try {

        const data = await getDashboardAnalytics();

        console.log(
            "Dashboard Analytics:",
            data
        );

        setAnalytics(data);

    } catch (error) {

        console.error(
            "Analytics loading failed:",
            error
        );

    }

  };
  useEffect(() => {

    loadFilteredReports();

  }, [
    address,
    status,
    severity,
    priority
  ]);

  if (loading) {
    return (
        <div className="smart-pave-page min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>

                <p className="mt-4 text-white font-semibold">
                    Loading Citizen Dashboard...
                </p>
            </div>
        </div>
    );
  }
  if (error) {
    return (
        <div className="smart-pave-page min-h-screen flex items-center justify-center">
            <div className="smart-glass rounded-2xl shadow-lg p-8 text-center">
                <h2 className="text-xl font-bold text-red-600">
                    Unable to Load Dashboard
                </h2>

                <p className="text-slate-300 mt-3">
                    {error}
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="smart-button mt-5 px-5 py-2"
                >
                    Retry
                </button>
            </div>
        </div>
    );
  }

  return (

    <div
      className="smart-pave-page citizen-dashboard min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${citizenBg})`
      }}
    >

        <div className="smart-pave-content">

            
              <div className="smart-welcome-card">

                  <div className="smart-welcome-content">

                      <h1 className="smart-dashboard-welcome">
                          Welcome, {userName} 👋
                      </h1>

                      <h2 className="smart-dashboard-title">
                          Citizen Dashboard
                      </h2>

                      <p className="smart-dashboard-subtitle">
                          Monitor your pothole reports and road complaints.
                      </p>

                  </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                <StatCard
                    title="Total Reports"
                    value={stats.total_reports}
                    color="bg-blue-600"
                    icon={<Road size={32} />}
                />

                <StatCard
                    title="Pending"
                    value={stats.pending}
                    color="bg-yellow-500"
                    icon={<Clock3 size={32} />}
                />

                <StatCard
                    title="Verified"
                    value={stats.verified}
                    color="bg-green-600"
                    icon={<CircleCheck size={32} />}
                />

                <StatCard
                    title="In Progress"
                    value={stats.in_progress}
                    color="bg-orange-500"
                    icon={<Wrench size={32} />}
                />

                <StatCard
                    title="Completed"
                    value={stats.completed}
                    color="bg-purple-600"
                    icon={<CheckCheck size={32} />}
                />

              </div>

              
              {/* Statistics */}
        {/* Notifications */}



       
              
              <div className="mt-10">
                    <RoadReportAnalytics />
                </div>

              
              <div className="mt-10">

                

              <ReportMap reports={reports}/>

              </div>

              <ReportForm onReportSubmitted={loadStats} />

              <RecentReports />


            

        </div>

    </div>

  );

};

export default Dashboard;
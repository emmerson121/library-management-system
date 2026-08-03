import Sidebar from "./sidebar";
import MainDashboard from "./maindashboard";
import Login from "./loginPage/login";
import UserDashboard from "../userdashboard/page";

export default function Dashboard() {
    return (
        <div className="w-full h-[100%] flex gap-10 bg-[#f2f2f2]">
            <div className="w-[23%] h-[400px]"><Sidebar /></div>
            <div className="w-[75%] h-auto "><MainDashboard /></div>
            {/* <UserDashboard /> */}
        </div>
    );
}
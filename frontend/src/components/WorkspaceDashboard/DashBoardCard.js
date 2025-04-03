// onclick to handle sprint kanban modal
const DashboardCard = ({ title, color, onClick }) => (
    <div
        onClick={onClick}
        className={`${color}  flex justify-center items-center text-2xl font-bold h-full bg-accent text-white rounded-lg shadow-md hover:scale-105 transition cursor-pointer`}
    >
        {title}
    </div>
);

export default DashboardCard;

import { useNavigate } from "react-router";


export function Card({ id, title, description }: { id: number; title: string; description: string }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/ficha/${id}`); // Navigate to character sheet with the character ID
        };
    return (
        <div onClick={handleClick} className={`bg-vaccineBlueTones-1000 text-white rounded-lg p-6 shadow-md border-2 border-transparent hover:border-white transition-all cursor-pointer w-full sm:w-[calc(33.333%-1rem)] min-w-[250px]`}>
            <h4 className="text-xl font-bold mb-2">{title}</h4>
            <p className="text-sm opacity-90">{description}</p>
        </div>
    )
}
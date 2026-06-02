import { useRef } from "react";

interface CharacterPhotosProps {
    photos: string[];
    handlePhotosChange: (photos: string[]) => void;
}

export function CharacterPhotos({
    photos,
    handlePhotosChange,
}: CharacterPhotosProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddPhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const newPhotos = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );

        handlePhotosChange([...photos, ...newPhotos]);
    };

    return (
        <section className="mb-8">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleAddPhotos}
            />

            {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-40 object-cover rounded-md border border-vaccineGray-300"
                        />
                    ))}
                </div>
            )}

            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-vaccineBlueTones-400 rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100"
                >
                    Adicionar Imagens +
                </button>
            </div>
        </section>
    );
}
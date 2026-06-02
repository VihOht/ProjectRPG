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

    const handleRemovePhoto = (indexToRemove: number) => {
        handlePhotosChange(
            photos.filter((_, index) => index !== indexToRemove)
        );
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {photos.map((photo, index) => (
                    <div key={index} className="relative">
                        <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="
                                absolute
                                top-2
                                left-2
                                z-10
                                w-6
                                h-6
                                flex
                                items-center
                                justify-center
                                rounded-full
                                text-white
                                text-sm
                                transition-colors
                            "
                        >
                            ×
                        </button>

                        <img
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            className="w-full object-cover rounded-md border border-vaccineGray-300"
                        />
                    </div>
                ))}
            </div>

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
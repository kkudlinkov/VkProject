import React, { useEffect } from "react";

interface EditModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: (name: string, description: string) => void;
    initialName: string;
    initialDescription: string;
}

const EditModal: React.FC<EditModalProps> = ({
                                                 isVisible,
                                                 onClose,
                                                 onSave,
                                                 initialName,
                                                 initialDescription,
                                             }) => {
    const [name, setName] = React.useState(initialName);
    const [description, setDescription] = React.useState(initialDescription);

    useEffect(() => {
        setName(initialName);
        setDescription(initialDescription);
    }, [initialName, initialDescription]);

    if (!isVisible) return null;

    const handleSubmit = () => {
        onSave(name, description);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-lg font-bold">Редактировать репозиторий</h2>
                <label htmlFor="repo-name">Название:</label>
                <input
                    id="repo-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName((e.target as HTMLInputElement).value)} // Type assertion here
                    className="border p-2 mb-2 w-full"
                />
                <label htmlFor="repo-description">Описание:</label>
                <input
                    id="repo-description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription((e.target as HTMLInputElement).value)} // Type assertion here
                    className="border p-2 mb-2 w-full"
                />
                <div className="mt-4">
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                        Сохранить
                    </button>
                    <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
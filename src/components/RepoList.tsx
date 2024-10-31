import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { repoStore } from "../store/RepoStore.ts";
import EditModal from "./EditModal";

interface Repository {
    id: number;
    name: string;
    description?: string;
    html_url: string;
}

interface ScrollableElement extends HTMLElement {
    scrollTop: number;
    clientHeight: number;
    scrollHeight: number;
}

const RepoList = observer(() => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRepo, setCurrentRepo] = useState<Repository | null>(null);
    const [sortField, setSortField] = useState<keyof Repository | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    useEffect(() => {
        repoStore.fetchData();
    }, []);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget as unknown as ScrollableElement;
        const { scrollTop, clientHeight, scrollHeight } = target;

        if (scrollTop + clientHeight >= scrollHeight - 5 && !repoStore.loading) {
            repoStore.loadMore();
        }
    };

    const handleDelete = (repoId: number) => {
        repoStore.removeRepository(repoId);

        if (repoStore.repositories.length < 10 && !repoStore.loading) {
            repoStore.loadMore();
        }
    };

    const handleEditClick = (repo: Repository) => {
        setCurrentRepo(repo);
        setIsModalVisible(true);
    };

    const handleEditSave = (newName: string, newDescription: string) => {
        if (currentRepo) {
            repoStore.editRepository(currentRepo.id, newName, newDescription);
        }
    };

    const handleSort = (field: keyof Repository) => {
        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
    };

    const resetSort = () => {
        setSortField(null);
        setSortOrder(null);
    };

    const sortedRepositories = [...repoStore.repositories].sort((a, b) => {
        if (sortField === null || sortOrder === null) return 0;

        const aValue = a[sortField] ?? '';
        const bValue = b[sortField] ?? '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
            return 0;
        }
    });

    const totalRepositories = sortedRepositories.length;
    const longestName = sortedRepositories.reduce((longest, repo) => repo.name.length > longest.length ? repo.name : longest, '');

    return (
        <>
            <div className="mt-12 container mx-auto">
                <div className="flex justify-between mb-4">
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <h3 className="font-bold">Информация о репозиториях</h3>
                        <p>Загружено репозиториев: <span className="font-semibold">{totalRepositories}</span></p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded shadow">
                        <h3 className="font-bold">Самое длинное название</h3>
                        <p><span className="font-semibold">{longestName}</span></p>
                    </div>
                </div>
                <button
                    onClick={resetSort}
                    className="mb-4 bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                >
                    Сбросить сортировку
                </button>
                <div onScroll={handleScroll} style={{height: '70vh', overflowY: 'auto'}}>
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="sticky top-0 bg-gray-200">
                        <tr>
                            <th onClick={() => handleSort('id')}
                                className="border border-gray-300 px-4 py-2 cursor-pointer">
                                ID {sortField === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : '→'}
                            </th>
                            <th onClick={() => handleSort('name')}
                                className="border border-gray-300 px-4 py-2 cursor-pointer">
                                Название {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '→'}
                            </th>
                            <th onClick={() => handleSort('description')}
                                className="border border-gray-300 px-4 py-2 cursor-pointer">
                                Описание {sortField === 'description' ? (sortOrder === 'asc' ? '↑' : '↓') : '→'}
                            </th>
                            <th className="border border-gray-300 px-4 py-2">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedRepositories.map((repo: Repository) => (
                            <tr key={repo.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-4">{repo.id}</td>

                                <td className="border border-gray-300 px-4 py-4">{repo.name}</td>
                                <td className="border border-gray-300 px-4 py-4">{repo.description || 'Нет описания'}</td>
                                <td className="border border-gray-300 px-4 py-4 flex gap-2 items-center">
                                    <button
                                        onClick={() => handleEditClick(repo)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(repo.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Удалить
                                    </button>
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-500 rounded px-3 py-1 text-white hover:underline ml-2"
                                    >
                                        Перейти
                                    </a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {repoStore.loading && (
                        <div role="alert" className="pt-2 flex justify-center items-center">
                            <div
                                className="animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500 w-12 h-12"></div>
                        </div>
                    )}
                </div>
                <EditModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    onSave={handleEditSave}
                    initialName={currentRepo?.name || ''}
                    initialDescription={currentRepo?.description || ''}
                />
            </div>
        </>
    );
});

export default RepoList;
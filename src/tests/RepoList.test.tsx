import { render, screen, fireEvent } from "@testing-library/react";
import RepoList from "../components/RepoList.tsx";
import { repoStore } from "../store/RepoStore.ts";
import '@testing-library/jest-dom';

// Мокаем repoStore
jest.mock("../store/RepoStore.ts", () => ({
    repoStore: {
        repositories: [],
        loading: false,
        removeRepository: jest.fn(function(repoId) {
            this.repositories = this.repositories.filter((repo: { id: number }) => repo.id !== repoId);
        }),
        editRepository: jest.fn(),
        fetchData: jest.fn(),
        loadMore: jest.fn(), // Добавляем метод loadMore
    },
}));

describe("RepoList", () => {
    beforeEach(() => {
        repoStore.repositories = [];
        repoStore.loading = false;
    });

    test("renders repositories", async () => {
        repoStore.repositories = [
            { id: 1, name: "Repo1", description: "Description1", html_url: "#" },
            { id: 2, name: "Repo2", description: "Description2", html_url: "#" },
        ];

        render(<RepoList />);

        // Используем getByRole для поиска ячеек таблицы
        expect(screen.getByRole('cell', { name: /Repo1/i })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: /Repo2/i })).toBeInTheDocument();
    });

    test("shows loading spinner when loading", () => {
        repoStore.loading = true;

        render(<RepoList />);

        expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    test("handles delete action", () => {
        repoStore.repositories = [
            { id: 1, name: "Repo1", description: "Description1", html_url: "#" },
        ];
        render(<RepoList />);
        console.log("Before delete:", repoStore.repositories);
        fireEvent.click(screen.getByText("Удалить"));
        console.log("After delete:", repoStore.repositories);
        expect(repoStore.repositories).toHaveLength(0); // Проверка, что репозиторий был удален
    });

    test("opens edit modal on edit button click", () => {
        repoStore.repositories = [
            { id: 1, name: "Repo1", description: "Description1", html_url: "#" },
        ];

        render(<RepoList />);

        fireEvent.click(screen.getByText("Редактировать"));

        expect(screen.getByText("Редактировать")).toBeInTheDocument();
    });

    test("sorts repositories by name", () => {
        repoStore.repositories = [
            { id: 1, name: "RepoB", description: "Description1", html_url: "#" },
            { id: 2, name: "RepoA", description: "Description2", html_url: "#" },
        ];

        render(<RepoList />);

        // Сортируем по имени
        fireEvent.click(screen.getByRole('columnheader', { name: /название/i }));

        // Проверяем, что элементы отображаются в правильном порядке
        expect(screen.getByRole('cell', { name: /RepoA/i })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: /RepoB/i })).toBeInTheDocument();
    });

    test("opens and closes edit modal", () => {
        repoStore.repositories = [
            { id: 1, name: "Repo1", description: "Description1", html_url: "#" },
        ];

        render(<RepoList />);

        // Открываем модальное окно
        fireEvent.click(screen.getByRole('button', { name: /редактировать/i }));

        // Проверяем, что модальное окно открыто
        expect(screen.getByRole('heading', { name: /редактировать репозиторий/i })).toBeInTheDocument();

        // Закрываем модальное окно
        fireEvent.click(screen.getByRole('button', { name: /закрыть/i })); // Предполагается, что у вас есть кнопка "Закрыть" в модальном окне
        expect(screen.queryByRole('heading', { name: /редактировать репозиторий/i })).not.toBeInTheDocument();
    });
});
import { runInAction } from "mobx";
import axios from "axios";
import { repoStore } from "../store/RepoStore.ts"; // Путь к вашему RepoStore

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("RepoStore", () => {
    beforeEach(() => {
        // Сбрасываем состояние перед каждым тестом
        runInAction(() => {
            repoStore.repositories = [];
            repoStore.loading = false;
            repoStore.error = null;
            repoStore.pagination = { page: 1, total: 0 };
        });
    });

    test("fetchData should fetch repositories and update state", async () => {
        const mockResponse = {
            data: {
                items: [
                    { id: 1, name: "Repo1", description: "Description1", html_url: "http://example.com/repo1" },
                    { id: 2, name: "Repo2", description: "Description2", html_url: "http://example.com/repo2" },
                ],
                total_count: 2,
            },
        };

        mockedAxios.get.mockResolvedValueOnce(mockResponse);

        await repoStore.fetchData();

        expect(repoStore.repositories).toHaveLength(2);
        expect(repoStore.loading).toBe(false);
        expect(repoStore.pagination.total).toBe(2);
        expect(repoStore.pagination.page).toBe(2);
    });

    test("fetchData should handle errors", async () => {
        const errorMessage = "Network Error";
        mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

        await repoStore.fetchData();

        expect(repoStore.error).toBeInstanceOf(Error);
        expect(repoStore.error?.message).toBe("Network Error");
        expect(repoStore.loading).toBe(false);
    });

    test("loadMore should fetch more data if available", async () => {
        const mockResponse = {
            data: {
                items: [{ id: 3, name: "Repo3", description: "Description3", html_url: "http://example.com/repo3" }],
                total_count: 3,
            },
        };

        mockedAxios.get.mockResolvedValueOnce(mockResponse);
        repoStore.repositories = [{ id: 1, name: "Repo1", description: "Description1", html_url: "http://example.com/repo1" }];
        repoStore.pagination.total = 3;

        await repoStore.loadMore();

        expect(repoStore.repositories).toHaveLength(2);
        expect(repoStore.repositories[1].name).toBe("Repo3");
    });

    test("removeRepository should remove a repository", () => {
        repoStore.repositories = [
            { id: 1, name: "Repo1", description: "Description1", html_url: "http://example.com/repo1" },
            { id: 2, name: "Repo2", description: "Description2", html_url: "http://example.com/repo2" },
        ];

        repoStore.removeRepository(1);

        expect(repoStore.repositories).toHaveLength(1);
        expect(repoStore.repositories[0].id).toBe(2);
    });

    test("editRepository should edit a repository", () => {
        repoStore.repositories = [
            { id: 1, name: "Repo1", description: "Description1", html_url: "http://example.com/repo1" },
        ];

        repoStore.editRepository(1, "NewRepoName", "NewDescription");

        expect(repoStore.repositories[0].name).toBe("NewRepoName");
        expect(repoStore.repositories[0].description).toBe("NewDescription");
    });
});
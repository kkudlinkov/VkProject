import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

interface Repository {
    id: number;
    name: string;
    description?: string;
    html_url: string;
}

interface Pagination {
    page: number;
    total: number;
}

class RepoStore {
    repositories: Repository[] = []; // Указываем тип
    loading: boolean = false;
    error: Error | null = null;

    pagination: Pagination = {
        page: 1,
        total: 0,
    };

    constructor() {
        makeAutoObservable(this);
    }

    async fetchData() {
        this.loading = true;
        try {
            console.log("Fetching data..."); // Добавьте лог
            const response = await axios.get(
                `https://api.github.com/search/repositories?q=javascript&sort=stars&order=asc&page=${this.pagination.page}`
            );

            runInAction(() => {
                this.repositories = [...this.repositories, ...response.data.items];
                this.pagination.total = response.data.total_count;
                this.pagination.page += 1;
                this.loading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err : new Error("Неизвестная ошибка");
                this.loading = false;
            });
        }
    }

    async loadMore() {
        // Проверяем, есть ли еще данные для загрузки
        if (this.repositories.length >= this.pagination.total) {
            return; // Если все данные загружены, ничего не делаем
        }
        this.pagination.page += 1; // Увеличиваем номер страницы перед загрузкой
        await this.fetchData();
    }

    removeRepository(repoId: number) {
        runInAction(() => {
            this.repositories = this.repositories.filter((repo: Repository) => repo.id !== repoId); // Указываем тип repo
        });
    }

    editRepository(repoId: number, newName: string, newDescription: string) {
        runInAction(() => {
            const repoIndex = this.repositories.findIndex(repo => repo.id === repoId);
            if (repoIndex !== -1) {
                this.repositories[repoIndex].name = newName;
                this.repositories[repoIndex].description = newDescription;
            }
        });
    }
}

export const repoStore = new RepoStore();
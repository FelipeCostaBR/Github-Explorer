import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

import api from '../../routes/api';
import { Header, RepositoryInfo, Issues } from './styles';
import logoImg from '../../assets/logo.svg';

interface RepositoryParams {
    repository: string;
}

interface Repository {
    full_name: string;
    description: string;
    startgazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
}

interface Issue {
    title: string;
    id: number;
    html_url: string;
    user: {
        login: string;
    };
}

const Repository: React.FC = () => {
    const [repository, setRepository] = useState<Repository | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);

    const { params } = useRouteMatch<RepositoryParams>();

    useEffect(() => {
        api.get(`repos/${params.repository}`).then(response => {
            setRepository(response.data);
        });

        api.get(`repos/${params.repository}/issues`).then(response => {
            setIssues(response.data);
        });

        // async function loadData(): Promise<void> {
        //     const [repository, issues] = await Promise.all([
        //         api.get(`repos/${params.repository}`),
        //         api.get(`repos/${params.repository}/issues`),
        //     ]);
        // }
        // loadData();
    }, [params.repository]);

    return (
        <>
            <Header>
                <img src={logoImg} alt="Github Explorer" />
                <Link to="/">
                    <FiChevronLeft size={16} />
                    Back
                </Link>
            </Header>
            {repository && (
                <RepositoryInfo>
                    <header>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>
                        <li>
                            <strong>{repository.startgazers_count}</strong>
                            <span>Starts</span>
                        </li>
                        <li>
                            <strong>{repository.forks_count}</strong>
                            <span>forks</span>
                        </li>
                        <li>
                            <strong>{repository.open_issues_count}</strong>
                            <span>Open Issues</span>
                        </li>
                    </ul>
                </RepositoryInfo>
            )}

            <Issues>
                {issues.map(issue => (
                    <a key={issue.id} href={issue.html_url}>
                        <div>
                            <strong>{issue.title}</strong>
                            <p>{issue.user.login}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </a>
                ))}
            </Issues>
        </>
    );
};

export default Repository;

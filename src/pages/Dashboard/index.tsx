import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import api from '../../routes/api';
import { Title, Form, Repositories, Error } from './styles';
import logoImg from '../../assets/logo.svg';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');

    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem(
            '@GithubExplore:repositories',
        );

        if (storageRepositories) {
            return JSON.parse(storageRepositories);
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(
            '@GithubExplore:repositories',
            JSON.stringify(repositories),
        );
    }, [repositories]);

    async function handleAddRepository(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();
        if (!newRepo) {
            setInputError('Type author/repository name');
            return;
        }
        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);
            const repository = response.data;

            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');
        } catch (err) {
            setInputError('Error to search this repository');
        }
    }

    return (
        <>
            <img src={logoImg} alt="Github Explore" />
            <Title>explore repositories at Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepo}
                    onChange={e => setNewRepo(e.target.value)}
                    placeholder="Type the repository name"
                />
                <button type="submit">Search</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link
                        key={repository.full_name}
                        to={`/repository/${repository.full_name}`}
                    >
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    );
};

export default Dashboard;

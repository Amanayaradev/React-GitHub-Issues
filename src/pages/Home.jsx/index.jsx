import React, { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositorios] = useState(() => {
    const repoStorage = localStorage.getItem('repositorios');
    return repoStorage ? JSON.parse(repoStorage) : [];
  });

  // Buscar
  useEffect(() => {
    const repoStorage = localStorage.getItem('repositorios');

    if (repoStorage) {
      setRepositorios(JSON.parse(repoStorage));
    }
  }, []);

  // Salvar alterações
  useEffect(() => {
    localStorage.setItem('repositorios', JSON.stringify(repositorios));
  }, [repositorios]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit() {
      try {
        if (newRepo === '') {
          throw new Error('Você precisa indicar um repositório!');
        }

        const response = await api.get(`repos/${newRepo}`);
        const hasRepo = repositorios.find(
          (repo) => repo.name === response.data.full_name
        );

        if (hasRepo) {
          throw new Error('Repositório Duplicado');
        }

        const data = {
          name: response.data.full_name,
        };

        setRepositorios([...repositorios, data]);
        setNewRepo('');
      } catch (error) {
        console.log(error);
      }
    }
    submit();
  }, [newRepo, repositorios]);

  const handleDelete = (repoName) => {
    const novoRepositorio = repositorios.filter(
      (repo) => repo.name !== repoName
    );
    setRepositorios(novoRepositorio);
  };

  const handleInputChange = (e) => {
    setNewRepo(e.target.value);
  };

  return (
    <div className='box-main'>
      <h1>Meus Repositórios</h1>

      <div className='center_box'>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Adicionar Repositórios'
            value={newRepo}
            onChange={handleInputChange}
          />

          <button className='button_pesquisar'>
            <span className='material-symbols-outlined'>add</span>
          </button>
        </form>

        <ul>
          {repositorios.map((repo, index) => (
            <li className='listaRepo' key={index}>
              <button
                onClick={() => handleDelete(repo.name)}
                className='button_icon material-symbols-outlined'
              >
                delete_sweep
              </button>
              <span>{repo.name}</span>
              <Link
                to={`/produto/${encodeURIComponent(repo.name)}`}
                className='button_icon'
              >
                <span className='material-symbols-outlined'>menu</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

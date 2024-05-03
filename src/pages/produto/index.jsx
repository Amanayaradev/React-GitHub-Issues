import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import api from '../../services/api';

function Produto() {
  const { produto } = useParams();
  const [dataUser, setDataUser] = useState([]);
  const [dataRepo, setDataRepo] = useState({});
  const [dataPag, setDataPag] = useState(1);
  const [filters, setFilters] = useState('open');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log('pag', dataUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodeProd = decodeURIComponent(produto);
        const [repositorioUser, repositorioOwner] = await Promise.all([
          api.get(`/repos/${decodeProd}`),
          api.get(`/repos/${decodeProd}/issues`, {
            params: {
              state: 'open',
              per_page: 5,
            },
          }),
        ]);
        setDataRepo(repositorioUser.data);
        setDataUser(repositorioOwner.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [produto]);

  useEffect(() => {
    const pag = async () => {
      try {
        const decodeProd = decodeURIComponent(produto);
        const response = await api.get(`/repos/${decodeProd}/issues`, {
          params: {
            state: filters,
            page: dataPag,
            per_page: 5,
          },
        });
        setDataUser(response.data);
      } catch (error) {
        setError(error);
      }
    };
    pag();
  }, [dataPag, produto, filters]);

  const handlePag = (pag) => {
    if (dataPag >= 0) {
      setDataPag(pag === 'back' ? dataPag - 1 : dataPag + 1);
    }
    setFilters(pag === 'open' ? 'open' : 'closed');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='box-produto'>
      {dataUser.length > 0 && (
        <div className='center-box'>
          <div>
            <Link to='/' className='material-symbols-outlined'>
              arrow_back_ios
            </Link>
          </div>
          <img className='img-logo' src={dataRepo.owner.avatar_url} alt={dataRepo.owner.login} />
          
          <h1>{dataRepo.name}</h1>
          <p>{dataRepo.description}</p>
        </div>
      )}
        <div className='filters'>
          <button
          className='btn-filter'
          type='submit' onClick={() => handlePag('open')}>
            open
          </button>
          <button
           className='btn-filter'
           type='submit' onClick={() => handlePag('closed')}>
            closed
          </button>
        </div>
      <ul className='center-box'>
        {dataUser.map((issue) => (
          <li className='listaRepo lista-user' key={String(issue.id)}>
            <img className='image-user' src={issue.user.avatar_url} alt={issue.user.login} />

            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>

                {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>

              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className='btn-back-next'>
        <button type='submit' onClick={() => handlePag('back')}>
        <span className="material-symbols-outlined">
          arrow_back
        </span>
        </button>
        <button type='submit' onClick={() => handlePag('next')}>
        <span className="material-symbols-outlined">
        arrow_forward
        </span>
        </button>
      </div>
    </div>
  );
}

export default Produto;

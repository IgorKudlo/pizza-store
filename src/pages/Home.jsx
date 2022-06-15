import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import PizzaBlock from '../components/PizzaBlock';
import { Pagination } from '../components/Pagination';
import { SearchContext } from '../App';
import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice';

const Home = () => {
  const { searchValue } = React.useContext(SearchContext);

  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const categoryId = useSelector((state) => state.filter.categoryId);
  const sortType = useSelector((state) => state.filter.sort);
  const currentPage = useSelector((state) => state.filter.currentPage);
  const dispatch = useDispatch();

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id))
  }

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  }

  React.useEffect(() => {
    setIsLoading(true);

    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const sortBy = sortType.sortProperty.replace('-', '');
    const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
    const search = searchValue ? `&search=${searchValue}` : '';

    axios.get(`https://628f35090e69410599d77935.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`)
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      });

    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);

  return (
    <div className='container'>
      <div className='content__top'>
        <Categories value={categoryId} onChangeCategory={(id) => onChangeCategory(id)} />
        <Sort />
      </div>
      <h2 className='content__title'>Все пиццы</h2>
      <div className='content__items'>
        { isLoading ? skeletons : pizzas }
      </div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
import css from './Loading.module.css';

const Loading = () => {
  return (
    <div className={css.wrapper}>
      <div className={css.spinner}></div>
      <p className={css.text}>Loading, please wait...</p>
    </div>
  );
};

export default Loading;

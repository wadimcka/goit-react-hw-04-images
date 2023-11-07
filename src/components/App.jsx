import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Searchbar from './Searchbar/Searchbar';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal/Modal';
import ImageGallery from './ImageGallery/ImageGallery';
import requestApi from './api/api';
import { Loader } from './Loader/Loader';
import Button from './Button/Button';

export const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [imagesData, setImagesData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [error, setError] = useState(null);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      if (!searchValue) {
        return;
      }
      setIsLoading(true);
      try {
        const { hits, totalHits } = await requestApi(searchValue, page);
        setImagesData(prevImagesData => [...prevImagesData, ...hits]);
        setTotalHits(totalHits);

        if (page === 1 && totalHits) {
          toast.success(`We found ${totalHits} images. `);
        }
        if (totalHits === 0) {
          toast.warn('Nothing was found for your request! Try again.');
          return;
        }
        setShowBtn(page < Math.ceil(totalHits / 12));
      } catch (error) {
        setError(error.message);
        toast.warn(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [page, searchValue]);

  const handlerFormValue = ({ searchValue }) => {
    setSearchValue(searchValue);
    setImagesData([]);
    setPage(1);
  };

  const openModal = modalData => {
    setIsOpenModal(true);
    setModalData(modalData);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setModalData(null);
  };

  const loadMore = () => {
    if (totalHits > 0 && totalHits - imagesData.length <= 12) {
      toast.warn(
        `There are ${totalHits - imagesData.length} or fewer images remaining.`
      );
    }
    setPage(prevPage => prevPage + 1);
  };
  return (
    <div>
      <Searchbar onSubmit={handlerFormValue} />
      {error !== null && toast.error(error)}
      {isLoading && <Loader />}
      <ImageGallery images={imagesData} openModal={openModal} />
      {showBtn && <Button onClick={loadMore} />}
      {isOpenModal && (
        <Modal
          largeImageURL={modalData.largeImageURL}
          tags={modalData.tags}
          closeModal={closeModal}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
